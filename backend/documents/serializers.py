from rest_framework import serializers

from .models import Document, DocumentVersion


class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = [
            "id",
            "case",
            "title",
            "document_type",
            "description",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]


class DocumentVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = DocumentVersion
        fields = [
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
        ]
        read_only_fields = [
            "id",
            "version_number",
            "file_path",
            "original_filename",
            "file_hash",
            "file_size",
            "mime_type",
            "uploaded_by",
            "uploaded_at",
        ]