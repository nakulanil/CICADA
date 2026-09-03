from django.urls import path

from .views import DocumentUploadView, DocumentDetailView

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

]