import uuid

from django.db import models


class Person(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    full_name = models.CharField(max_length=255)

    date_of_birth = models.DateField(
        null=True,
        blank=True,
    )

    gender = models.CharField(
        max_length=30,
        blank=True,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name

class CasePerson(models.Model):
    class InvolvementType(models.TextChoices):
        ACCUSED = "ACCUSED", "Accused"
        VICTIM = "VICTIM", "Victim"
        WITNESS = "WITNESS", "Witness"
        COMPLAINANT = "COMPLAINANT", "Complainant"
        SUSPECT = "SUSPECT", "Suspect"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        "cases.Case",
        on_delete=models.CASCADE,
        related_name="persons",
    )

    person = models.ForeignKey(
        Person,
        on_delete=models.PROTECT,
        related_name="cases",
    )

    involvement_type = models.CharField(
        max_length=30,
        choices=InvolvementType.choices,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["case", "person", "involvement_type"],
                name="unique_case_person_involvement",
            )
        ]

    def __str__(self):
        return f"{self.person} - {self.case} ({self.involvement_type})"