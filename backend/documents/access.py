from django.utils import timezone


def has_document_permission(user, document, permission):
    access = document.access_permissions.filter(
        user=user,
        permission=permission,
        is_active=True,
    ).first()

    if access is None:
        return False

    if access.expires_at and access.expires_at < timezone.now():
        return False

    return True