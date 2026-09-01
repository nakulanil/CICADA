from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
    class OrganizationType(models.TextChoices):
        POLICE= "POLICE", "Police"
        FORENSIC= "FORENSIC", "Forensic Laboratory"
        PROSECUTION= "PROSECUTION", "Prosecution"
        COURT= "COURT", "Court"

    name = models.CharField(max_length=255)
    organization_type = models.CharField(
        max_length=20,
        choices=OrganizationType.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.username