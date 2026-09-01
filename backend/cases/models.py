import uuid

from django.conf import settings
from django.db import models


class Case(models.Model):
    class CaseStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        UNDER_INVESTIGATION = "UNDER_INVESTIGATION", "Under Investigation"
        IN_COURT = "IN_COURT", "In Court"
        CLOSED = "CLOSED", "Closed"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case_number = models.CharField(
        max_length=100,
        unique=True,
    )

    title = models.CharField(max_length=255)

    case_type = models.CharField(
        max_length=100,
    )

    status = models.CharField(
        max_length=30,
        choices=CaseStatus.choices,
        default=CaseStatus.ACTIVE,
    )

    description = models.TextField(blank=True)

    police_station = models.CharField(
        max_length=255,
        blank=True,
    )

    jurisdiction = models.CharField(
        max_length=255,
        blank=True,
    )

    opened_at = models.DateTimeField()

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_cases",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.case_number} - {self.title}"

class CaseMember(models.Model):
    class CaseRole(models.TextChoices):
        LEAD_INVESTIGATOR = "LEAD_INVESTIGATOR", "Lead Investigator"
        SUPPORTING_INVESTIGATOR = "SUPPORTING_INVESTIGATOR", "Supporting Investigator"
        SUPERVISOR = "SUPERVISOR", "Supervisor"
        FORENSIC_OFFICER = "FORENSIC_OFFICER", "Forensic Officer"
        PROSECUTOR = "PROSECUTOR", "Prosecutor"
        COURT_STAFF = "COURT_STAFF", "Court Staff"
        JUDGE = "JUDGE", "Judge"
        OBSERVER = "OBSERVER", "Observer"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        Case,
        on_delete=models.CASCADE,
        related_name="members",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="case_memberships",
    )

    case_role = models.CharField(
        max_length=30,
        choices=CaseRole.choices,
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    removed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["case", "user"],
                name="unique_case_member",
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.case} ({self.case_role})"