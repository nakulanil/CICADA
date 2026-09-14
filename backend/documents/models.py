import uuid

from django.conf import settings
from django.db import models


class Document(models.Model):

    class DocumentType(models.TextChoices):
        FIR = "FIR", "FIR"
        POLICE_REPORT = "POLICE_REPORT", "Police Report"
        WITNESS_STATEMENT = "WITNESS_STATEMENT", "Witness Statement"
        CHARGE_SHEET = "CHARGE_SHEET", "Charge Sheet"
        COURT_FILING = "COURT_FILING", "Court Filing"
        EVIDENCE_RECORD = "EVIDENCE_RECORD", "Evidence Record"
        FORENSIC_REPORT = "FORENSIC_REPORT", "Forensic Report"
        LEGAL_NOTICE = "LEGAL_NOTICE", "Legal Notice"
        JUDGMENT = "JUDGMENT", "Judgment"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        "cases.Case",
        on_delete=models.PROTECT,
        related_name="documents",
    )

    title = models.CharField(
        max_length=255,
    )

    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices,
    )

    description = models.TextField(
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_documents",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.title


class DocumentVersion(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="versions",
    )

    version_number = models.PositiveIntegerField()

    file_path = models.FileField(
        upload_to="documents/",
    )

    original_filename = models.CharField(
        max_length=255,
    )

    file_hash = models.CharField(
        max_length=64,
        help_text="SHA-256 hash of the file.",
    )

    file_size = models.PositiveBigIntegerField()

    mime_type = models.CharField(
        max_length=100,
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="uploaded_document_versions",
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["document", "version_number"],
                name="unique_document_version",
            )
        ]
        ordering = ["-version_number"]

    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"


class DocumentProcessingResult(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    document_version = models.OneToOneField(
        "documents.DocumentVersion",
        on_delete=models.CASCADE,
        related_name="processing_result",
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("COMPLETED", "Completed"),
            ("FAILED", "Failed"),
        ],
        default="PENDING",
    )

    extraction_method = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    page_count = models.PositiveIntegerField(
        null=True,
    )

    raw_text = models.TextField(
        blank=True,
    )

    cleaned_text = models.TextField(
        blank=True,
    )

    average_ocr_confidence = models.FloatField(
        null=True,
    )

    fir_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    fir_date = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    fir_year = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )

    district = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    police_station = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    suspected_offence = models.TextField(
        blank=True,
        null=True,
    )

    sections = models.JSONField(
        default=list,
        blank=True,
    )

    error_message = models.TextField(
        blank=True,
    )

    processed_at = models.DateTimeField(
        auto_now_add=True,
    )


class Evidence(models.Model):

    class EvidenceStatus(models.TextChoices):
        COLLECTED = "COLLECTED", "Collected"
        IN_CUSTODY = "IN_CUSTODY", "In Custody"
        SUBMITTED = "SUBMITTED", "Submitted"
        ANALYZED = "ANALYZED", "Analyzed"
        RELEASED = "RELEASED", "Released"
        DISPOSED = "DISPOSED", "Disposed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        "cases.Case",
        on_delete=models.PROTECT,
        related_name="evidence",
    )

    evidence_number = models.CharField(
        max_length=100,
    )

    evidence_type = models.CharField(
        max_length=100,
    )

    description = models.TextField()

    collected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="collected_evidence",
    )

    collected_at = models.DateTimeField()

    collection_location = models.CharField(
        max_length=255,
    )

    status = models.CharField(
        max_length=20,
        choices=EvidenceStatus.choices,
        default=EvidenceStatus.COLLECTED,
    )

    current_custodian = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="custodied_evidence",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["case", "evidence_number"],
                name="unique_case_evidence_number",
            )
        ]

    def __str__(self):
        return f"{self.evidence_number} - {self.case}"


class CustodyEvent(models.Model):

    class Action(models.TextChoices):
        COLLECTED = "COLLECTED", "Collected"
        TRANSFERRED = "TRANSFERRED", "Transferred"
        RECEIVED = "RECEIVED", "Received"
        SUBMITTED = "SUBMITTED", "Submitted"
        RELEASED = "RELEASED", "Released"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    evidence = models.ForeignKey(
        Evidence,
        on_delete=models.PROTECT,
        related_name="custody_events",
    )

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="custody_transfers_out",
        null=True,
        blank=True,
    )

    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="custody_transfers_in",
        null=True,
        blank=True,
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,
    )

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    reason = models.TextField(
        blank=True,
    )

    integrity_hash = models.CharField(
        max_length=64,
        blank=True,
        help_text="SHA-256 hash associated with the custody event.",
    )

    def __str__(self):
        return f"{self.evidence.evidence_number} - {self.action}"

class DocumentAccess(models.Model):

    class Permission(models.TextChoices):
        VIEW = "VIEW", "View"
        DOWNLOAD = "DOWNLOAD", "Download"
        EDIT = "EDIT", "Edit"
        SHARE = "SHARE", "Share"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="access_permissions",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="document_permissions",
    )

    permission = models.CharField(
        max_length=20,
        choices=Permission.choices,
    )

    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="granted_document_permissions",
    )

    granted_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["document", "user", "permission"],
                name="unique_document_user_permission",
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.document} ({self.permission})"