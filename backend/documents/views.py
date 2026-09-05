from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.http import FileResponse

from cases.models import CaseMember
from audit.models import AuditLog

from .models import Document, DocumentVersion
from .utils import calculate_file_hash


# Allowed file types for legal documents
ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
}

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
}


def get_case_membership(case, user):
    """
    Return the active case membership for a user.
    Returns None if the user is not an active member.
    """
    return CaseMember.objects.filter(
        case=case,
        user=user,
        is_active=True,
    ).first()


def get_file_extension(filename):
    """
    Return the lowercase file extension.
    """
    filename = filename.lower()

    if "." not in filename:
        return ""

    return "." + filename.rsplit(".", 1)[1]


def validate_uploaded_file(file):
    """
    Validate basic file properties before storing the file.
    No file-size limit is applied.
    """

    if file.size == 0:
        return "Uploaded file is empty."

    extension = get_file_extension(file.name)

    if extension not in ALLOWED_EXTENSIONS:
        return (
            "File type is not allowed. "
            "Allowed types: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG."
        )

    content_type = file.content_type

    if content_type and content_type not in ALLOWED_MIME_TYPES:
        return "The uploaded file MIME type is not allowed."

    return None


def create_access_denied_log(
    user,
    resource_type,
    resource_id,
    description,
    request
):
    """
    Create a standard ACCESS_DENIED audit log.
    """
    AuditLog.objects.create(
        user=user,
        action=AuditLog.Action.ACCESS_DENIED,
        resource_type=resource_type,
        resource_id=str(resource_id),
        description=description,
        ip_address=request.META.get("REMOTE_ADDR"),
    )


class DocumentUploadView(APIView):

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        file = request.FILES.get("file")
        document_id = request.data.get("document_id")

        if not file:
            return Response(
                {"error": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not document_id:
            return Response(
                {"error": "document_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate uploaded file
        validation_error = validate_uploaded_file(file)

        if validation_error:
            return Response(
                {"error": validation_error},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            document = (
                Document.objects
                .select_related("case")
                .get(id=document_id)
            )
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check case membership
        membership = get_case_membership(
            document.case,
            request.user
        )

        if not membership:
            create_access_denied_log(
                request.user,
                "Document",
                document.id,
                f"Upload access denied for document: {document.title}",
                request,
            )

            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Calculate SHA-256 hash
        file_hash = calculate_file_hash(file)

        # Reset file position after hashing
        file.seek(0)

        # Create the next version safely
        with transaction.atomic():

            latest_version = (
                DocumentVersion.objects
                .select_for_update()
                .filter(document=document)
                .order_by("-version_number")
                .first()
            )

            if latest_version:
                version_number = latest_version.version_number + 1
            else:
                version_number = 1

            document_version = DocumentVersion.objects.create(
                document=document,
                version_number=version_number,
                file_path=file,
                original_filename=file.name,
                file_hash=file_hash,
                file_size=file.size,
                mime_type=file.content_type or "application/octet-stream",
                uploaded_by=request.user,
            )

        # Create audit log for successful upload
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.UPLOAD,
            resource_type="DocumentVersion",
            resource_id=str(document_version.id),
            description=(
                f"Uploaded version {version_number} "
                f"of document: {document.title}"
            ),
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(
            {
                "message": "Document uploaded successfully.",
                "document_id": str(document.id),
                "version_id": str(document_version.id),
                "version_number": version_number,
                "file_name": file.name,
                "file_size": file.size,
                "mime_type": document_version.mime_type,
                "sha256": file_hash,
                "uploaded_by": request.user.username,
            },
            status=status.HTTP_201_CREATED
        )


class DocumentDetailView(APIView):

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, document_id):

        try:
            document = (
                Document.objects
                .select_related("case", "created_by")
                .get(id=document_id)
            )
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check case membership
        membership = get_case_membership(
            document.case,
            request.user
        )

        if not membership:
            create_access_denied_log(
                request.user,
                "Document",
                document.id,
                f"View access denied for document: {document.title}",
                request,
            )

            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create audit log for successful document view
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.READ,
            resource_type="Document",
            resource_id=str(document.id),
            description=f"Viewed document: {document.title}",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        versions = (
            document.versions
            .select_related("uploaded_by")
            .all()
        )

        version_data = []

        for version in versions:
            version_data.append({
                "version_id": str(version.id),
                "version_number": version.version_number,
                "file_name": version.file_path.name,
                "original_filename": version.original_filename,
                "sha256": version.file_hash,
                "file_size": version.file_size,
                "mime_type": version.mime_type,
                "uploaded_by": version.uploaded_by.username,
                "uploaded_at": timezone.localtime(
                    version.uploaded_at
                ).isoformat(),
            })

        return Response({
            "document_id": str(document.id),
            "title": document.title,
            "document_type": document.document_type,
            "description": document.description,
            "created_by": document.created_by.username,
            "created_at": timezone.localtime(
                document.created_at
            ).isoformat(),
            "versions": version_data,
        })


class DocumentDownloadView(APIView):

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, version_id):

        try:
            version = (
                DocumentVersion.objects
                .select_related("document__case")
                .get(id=version_id)
            )
        except DocumentVersion.DoesNotExist:
            return Response(
                {"error": "Document version not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check case membership
        membership = get_case_membership(
            version.document.case,
            request.user
        )

        if not membership:
            create_access_denied_log(
                request.user,
                "DocumentVersion",
                version.id,
                (
                    f"Download access denied for document: "
                    f"{version.document.title}"
                ),
                request,
            )

            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not version.file_path:
            return Response(
                {"error": "File not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create audit log for successful download
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.DOWNLOAD,
            resource_type="DocumentVersion",
            resource_id=str(version.id),
            description=(
                f"Downloaded version {version.version_number} "
                f"of document: {version.document.title}"
            ),
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return FileResponse(
            version.file_path.open("rb"),
            content_type=version.mime_type,
            as_attachment=True,
            filename=(
                version.original_filename
                or version.file_path.name.split("/")[-1]
            ),
        )


class DocumentIntegrityView(APIView):

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, version_id):

        try:
            version = (
                DocumentVersion.objects
                .select_related("document__case")
                .get(id=version_id)
            )
        except DocumentVersion.DoesNotExist:
            return Response(
                {"error": "Document version not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check case membership
        membership = get_case_membership(
            version.document.case,
            request.user
        )

        if not membership:
            create_access_denied_log(
                request.user,
                "DocumentVersion",
                version.id,
                (
                    f"Integrity verification access denied for document: "
                    f"{version.document.title}"
                ),
                request,
            )

            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not version.file_path:
            return Response(
                {"error": "File not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate hash of the currently stored file
        with version.file_path.open("rb") as file:
            current_hash = calculate_file_hash(file)

        stored_hash = version.file_hash

        if current_hash == stored_hash:
            integrity = "VALID"
        else:
            integrity = "ALTERED"

        # Create audit log
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.READ,
            resource_type="DocumentVersion",
            resource_id=str(version.id),
            description=(
                f"Integrity verification for version "
                f"{version.version_number} of document: "
                f"{version.document.title} - {integrity}"
            ),
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response({
            "version_id": str(version.id),
            "document_id": str(version.document.id),
            "version_number": version.version_number,
            "stored_hash": stored_hash,
            "current_hash": current_hash,
            "integrity": integrity,
        })


class DocumentSearchView(APIView):

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        search = request.query_params.get(
            "search",
            ""
        ).strip()

        document_type = request.query_params.get(
            "document_type",
            ""
        ).strip()

        case_number = request.query_params.get(
            "case_number",
            ""
        ).strip()

        # Only return documents from active case memberships
        documents = (
            Document.objects
            .filter(
                case__members__user=request.user,
                case__members__is_active=True,
            )
            .select_related("case", "created_by")
            .distinct()
        )

        if search:
            documents = documents.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        if document_type:
            documents = documents.filter(
                document_type=document_type
            )

        if case_number:
            documents = documents.filter(
                case__case_number__icontains=case_number
            )

        results = []

        for document in documents:
            results.append({
                "document_id": str(document.id),
                "title": document.title,
                "document_type": document.document_type,
                "case_id": str(document.case.id),
                "case_number": document.case.case_number,
                "description": document.description,
                "created_by": document.created_by.username,
                "created_at": timezone.localtime(
                    document.created_at
                ).isoformat(),
            })

        # Audit document search
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.READ,
            resource_type="DocumentSearch",
            resource_id="",
            description=(
                f"Document search performed by "
                f"{request.user.username}. "
                f"search={search}, "
                f"document_type={document_type}, "
                f"case_number={case_number}"
            ),
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response({
            "count": len(results),
            "results": results,
        })