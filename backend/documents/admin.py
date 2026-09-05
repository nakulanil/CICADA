from django.contrib import admin

from .models import (
    Document,
    DocumentVersion,
    Evidence,
    CustodyEvent,
)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "document_type",
        "case",
        "created_by",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "document_type",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "case__case_number",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = (
        "document",
        "version_number",
        "original_filename",
        "file_hash",
        "file_size",
        "mime_type",
        "uploaded_by",
        "uploaded_at",
    )

    list_filter = (
        "mime_type",
        "uploaded_at",
    )

    search_fields = (
        "original_filename",
        "file_hash",
        "document__title",
        "document__case__case_number",
    )

    readonly_fields = (
        "id",
        "document",
        "version_number",
        "file_path",
        "original_filename",
        "file_hash",
        "file_size",
        "mime_type",
        "uploaded_by",
        "uploaded_at",
    )


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = (
        "evidence_number",
        "case",
        "evidence_type",
        "status",
        "collected_by",
        "collected_at",
        "current_custodian",
    )

    list_filter = (
        "status",
        "evidence_type",
        "collected_at",
    )

    search_fields = (
        "evidence_number",
        "evidence_type",
        "description",
        "case__case_number",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(CustodyEvent)
class CustodyEventAdmin(admin.ModelAdmin):
    list_display = (
        "evidence",
        "action",
        "from_user",
        "to_user",
        "timestamp",
        "location",
    )

    list_filter = (
        "action",
        "timestamp",
    )

    search_fields = (
        "evidence__evidence_number",
        "reason",
        "location",
    )

    readonly_fields = (
        "id",
        "timestamp",
    )