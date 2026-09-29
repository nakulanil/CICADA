from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.utils import timezone

from rest_framework.test import APIClient

from accounts.models import Organization, Role, User
from cases.models import Case, CaseMember

from .models import Document, DocumentVersion


@override_settings(
    STORAGES={
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
)
class DocumentTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Organization
        self.organization = Organization.objects.create(
            name="Test Organization"
        )

        # Role
        self.role = Role.objects.create(
            name="Test Role",
            description="Test role for automated testing"
        )

        # Users
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            organization=self.organization,
            role=self.role,
        )

        self.other_user = User.objects.create_user(
            username="otheruser",
            password="testpass123",
            organization=self.organization,
            role=self.role,
        )

        self.unauthorized_user = User.objects.create_user(
            username="unauthorized",
            password="testpass123",
            organization=self.organization,
            role=self.role,
        )

        # Case
        self.case = Case.objects.create(
            case_number="CASE-TEST-001",
            title="Test FIR Case",
            case_type="FIR",
            status="ACTIVE",
            description="Test case for automated document testing",
            police_station="Test Police Station",
            jurisdiction="Test Jurisdiction",
            opened_at=timezone.now(),
            created_by=self.user,
        )

        # Case members
        CaseMember.objects.create(
            case=self.case,
            user=self.user,
            case_role="LEAD_INVESTIGATOR",
        )

        CaseMember.objects.create(
            case=self.case,
            user=self.other_user,
            case_role="SUPPORTING_INVESTIGATOR",
        )

        # Unauthorized user is intentionally not added
        # as a CaseMember.

        # Document
        self.document = Document.objects.create(
            case=self.case,
            title="Test FIR Document",
            document_type="FIR",
            description="Test document",
            created_by=self.user,
        )

    # ======================================================
    # AUTHENTICATION HELPERS
    # ======================================================

    def login_user(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "testuser",
                "password": "testpass123",
            },
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {response.data['token']}"
        )


    def login_other_user(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "otheruser",
                "password": "testpass123",
            },
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {response.data['token']}"
        )


    def login_unauthorized_user(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "unauthorized",
                "password": "testpass123",
            },
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {response.data['token']}"
        )

    # ======================================================
    # FILE HELPER
    # ======================================================

    def create_test_file(
        self,
        name="test_fir.txt",
        content=b"This is a test FIR document."
    ):
        return SimpleUploadedFile(
            name,
            content,
            content_type="text/plain",
        )

    # ======================================================
    # TEST 1 - DOCUMENT UPLOAD
    # ======================================================

    def test_document_upload(self):
        self.login_user()

        test_file = self.create_test_file()

        response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        print(
            "\nUPLOAD RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            DocumentVersion.objects.filter(
                document=self.document
            ).count(),
            1,
        )

    # ======================================================
    # TEST 2 - SHA-256 HASH
    # ======================================================

    def test_sha256_hash_generation(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"SHA256 TEST CONTENT"
        )

        response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)

        version = DocumentVersion.objects.get(
            document=self.document
        )

        self.assertIsNotNone(version.file_hash)

        self.assertEqual(
            len(version.file_hash),
            64,
        )

    # ======================================================
    # TEST 3 - UNAUTHORIZED ACCESS
    # ======================================================

    def test_unauthorized_document_access(self):
        self.login_unauthorized_user()

        test_file = self.create_test_file(
            content=b"UNAUTHORIZED TEST FILE"
        )

        response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        print(
            "\nUNAUTHORIZED RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    # ======================================================
    # TEST 4 - DOCUMENT DETAIL
    # ======================================================

    def test_document_detail(self):
        self.login_user()

        response = self.client.get(
            f"/documents/{self.document.id}/"
        )

        print(
            "\nDETAIL RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    # ======================================================
    # TEST 5 - DOCUMENT SEARCH
    # ======================================================

    def test_document_search(self):
        self.login_user()

        response = self.client.get(
            "/documents/search/"
        )

        print(
            "\nSEARCH RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    # ======================================================
    # TEST 6 - DOCUMENT DOWNLOAD
    # ======================================================

    def test_document_download(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"DOWNLOAD TEST CONTENT"
        )

        upload_response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            upload_response.status_code,
            201,
        )

        version = DocumentVersion.objects.get(
            document=self.document
        )

        response = self.client.get(
            f"/documents/version/{version.id}/download/"
        )

        print(
            "\nDOWNLOAD RESPONSE:",
            response.status_code
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    # ======================================================
    # TEST 7 - INTEGRITY VALID
    # ======================================================

    def test_document_integrity_valid(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"ORIGINAL INTEGRITY CONTENT"
        )

        upload_response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            upload_response.status_code,
            201,
        )

        version = DocumentVersion.objects.get(
            document=self.document
        )

        response = self.client.get(
            f"/documents/version/{version.id}/verify/"
        )

        print(
            "\nINTEGRITY RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json()["integrity"],
            "VALID",
        )

    # ======================================================
    # TEST 8 - TAMPER DETECTION
    # ======================================================

    def test_document_integrity_tampered(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"ORIGINAL FILE CONTENT"
        )

        upload_response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            upload_response.status_code,
            201,
        )

        version = DocumentVersion.objects.get(
            document=self.document
        )

        with version.file_path.open("wb") as file:
            file.write(
                b"TAMPERED FILE CONTENT"
            )

        response = self.client.get(
            f"/documents/version/{version.id}/verify/"
        )

        print(
            "\nTAMPER RESPONSE:",
            response.status_code,
            response.content
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json()["integrity"],
            "ALTERED",
        )

    # ======================================================
    # TEST 9 - DOCUMENT VERSIONING
    # ======================================================

    def test_document_versioning(self):
        self.login_user()

        # Version 1
        file1 = SimpleUploadedFile(
            "version1.txt",
            b"FIR DOCUMENT VERSION ONE - ORIGINAL CONTENT",
            content_type="text/plain",
        )

        response1 = self.client.post(
            "/documents/upload/",
            {
                "file": file1,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            response1.status_code,
            201,
        )

        # Version 2
        file2 = SimpleUploadedFile(
            "version2.txt",
            b"FIR DOCUMENT VERSION TWO - UPDATED CONTENT",
            content_type="text/plain",
        )

        response2 = self.client.post(
            "/documents/upload/",
            {
                "file": file2,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            response2.status_code,
            201,
        )

        versions = DocumentVersion.objects.filter(
            document=self.document
        ).order_by("version_number")

        self.assertEqual(
            versions.count(),
            2,
        )

        version1 = versions[0]
        version2 = versions[1]

        self.assertEqual(
            version1.version_number,
            1,
        )

        self.assertEqual(
            version2.version_number,
            2,
        )

        self.assertNotEqual(
            version1.file_hash,
            version2.file_hash,
        )

        self.assertTrue(
            version1.file_path
        )

        self.assertTrue(
            version2.file_path
        )

    # ======================================================
    # TEST 10 - UPLOAD AUDIT LOG
    # ======================================================

    def test_upload_audit_log(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"AUDIT UPLOAD TEST"
        )

        response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            201,
        )

        from audit.models import AuditLog

        audit_exists = AuditLog.objects.filter(
            action="UPLOAD",
            user=self.user,
        ).exists()

        self.assertTrue(
            audit_exists
        )

    # ======================================================
    # TEST 11 - DOWNLOAD AUDIT LOG
    # ======================================================

    def test_download_audit_log(self):
        self.login_user()

        test_file = self.create_test_file(
            content=b"AUDIT DOWNLOAD TEST"
        )

        upload_response = self.client.post(
            "/documents/upload/",
            {
                "file": test_file,
                "document_id": str(self.document.id),
            },
            format="multipart",
        )

        self.assertEqual(
            upload_response.status_code,
            201,
        )

        version = DocumentVersion.objects.get(
            document=self.document
        )

        response = self.client.get(
            f"/documents/version/{version.id}/download/"
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        from audit.models import AuditLog

        audit_exists = AuditLog.objects.filter(
            action="DOWNLOAD",
            user=self.user,
        ).exists()

        self.assertTrue(
            audit_exists
        )