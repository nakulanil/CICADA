from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Document, DocumentVersion
from .utils import calculate_file_hash

from django.http import FileResponse
from django.shortcuts import get_object_or_404

from cases.models import CaseMember

from audit.models import AuditLog


class DocumentUploadView(APIView):

  
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

        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not CaseMember.objects.filter(
            case=document.case,
            user=request.user,
            is_active=True,
        ).exists():
            AuditLog.objects.create(
                user=request.user,
                action=AuditLog.Action.ACCESS_DENIED,
                resource_type="Document",
                resource_id=str(document.id),
                description=f"Denied upload access to document '{document.title}'.",
                ip_address=request.META.get("REMOTE_ADDR"),
            )
            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        file_hash = calculate_file_hash(file)

        version_number = document.versions.count() + 1

        document_version = DocumentVersion.objects.create(
            document=document,
            version_number=version_number,
            file_path=file,
            file_hash=file_hash,
            file_size=file.size,
            mime_type=file.content_type,
            uploaded_by=request.user,
        )

        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.UPLOAD,
            resource_type="DocumentVersion",
            resource_id=str(document_version.id),
            description=f"Uploaded version {version_number} of document '{document.title}'.",
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
                "mime_type": file.content_type,
                "sha256": file_hash,
                "uploaded_by": request.user.username,
            },
            status=status.HTTP_201_CREATED
        )


class DocumentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, document_id):
        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not CaseMember.objects.filter(
            case=document.case,
            user=request.user,
            is_active=True,
        ).exists():
            AuditLog.objects.create(
                user=request.user,
                action=AuditLog.Action.ACCESS_DENIED,
                resource_type="Document",
                resource_id=str(document.id),
                description=f"Denied read access to document '{document.title}'.",
                ip_address=request.META.get("REMOTE_ADDR"),
            )
            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )

        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.READ,
            resource_type="Document",
            resource_id=str(document.id),
            description=f"Read document '{document.title}'.",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        versions = document.versions.all()

        version_data = []

        for version in versions:
            version_data.append({
                "version_id": str(version.id),
                "version_number": version.version_number,
                "file_name": version.file_path.name,
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
            "versions": version_data,
        })

class DocumentDownloadView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, version_id):
        version = get_object_or_404(
            DocumentVersion,
            id=version_id
        )

        if not CaseMember.objects.filter(
            case=version.document.case,
            user=request.user,
            is_active=True,
        ).exists():
            AuditLog.objects.create(
                user=request.user,
                action=AuditLog.Action.ACCESS_DENIED,
                resource_type="DocumentVersion",
                resource_id=str(version.id),
                description=f"Denied download access to version {version.version_number} of document '{version.document.title}'.",
                ip_address=request.META.get("REMOTE_ADDR"),
            )
            return Response(
                {"error": "You do not have access to this case."},
                status=status.HTTP_403_FORBIDDEN
            )
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.DOWNLOAD,
            resource_type="DocumentVersion",
            resource_id=str(version.id),
            description=f"Downloaded version {version.version_number} of document '{version.document.title}'.",
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        if not version.file_path:
            return Response(
                {"error": "File not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return FileResponse(
            version.file_path.open("rb"),
            as_attachment=True,
            filename=version.file_path.name.split("/")[-1],
        )