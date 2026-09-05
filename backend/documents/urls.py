from django.urls import path

from .views import DocumentUploadView, DocumentDetailView, DocumentDownloadView


urlpatterns = [

    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload"
    ),

    path(
        "<uuid:document_id>/",
        DocumentDetailView.as_view(),
        name="document-detail"
    ),

    path(
        "versions/<uuid:version_id>/download/",
        DocumentDownloadView.as_view(),
        name="document-download"
    ),

]