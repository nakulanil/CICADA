from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Document, DocumentVersion
from .utils import calculate_file_hash


class DocumentUploadView(APIView):

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_hash = calculate_file_hash(file)

        return Response(
            {
                "message": "File received successfully.",
                "file_name": file.name,
                "file_size": file.size,
                "mime_type": file.content_type,
                "sha256": file_hash,
            },
            status=status.HTTP_200_OK
        )
