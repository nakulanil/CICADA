from django.urls import path
from .views import (
    DocumentUploadView,
    DocumentDetailView,
    DocumentDownloadView,
    DocumentIntegrityView,
    DocumentSearchView,
)

urlpatterns = [
    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload",
    ),

    path(
        "version/<uuid:version_id>/download/",
        DocumentDownloadView.as_view(),
        name="document-download",
    ),

    path(
        "version/<uuid:version_id>/verify/",
        DocumentIntegrityView.as_view(),
        name="document-integrity",
    ),

    path(
        "search/",
        DocumentSearchView.as_view(),
        name="document-search",
    ),

    path(
        "<uuid:document_id>/",
        DocumentDetailView.as_view(),
        name="document-detail",
    ),
]