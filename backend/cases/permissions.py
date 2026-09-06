from .models import CaseMember


# Permissions for case-level document operations.
DOCUMENT_PERMISSIONS = {
    "view": {
        CaseMember.CaseRole.LEAD_INVESTIGATOR,
        CaseMember.CaseRole.SUPPORTING_INVESTIGATOR,
        CaseMember.CaseRole.SUPERVISOR,
        CaseMember.CaseRole.FORENSIC_OFFICER,
        CaseMember.CaseRole.PROSECUTOR,
        CaseMember.CaseRole.COURT_STAFF,
        CaseMember.CaseRole.JUDGE,
        CaseMember.CaseRole.OBSERVER,
    },
    "download": {
        CaseMember.CaseRole.LEAD_INVESTIGATOR,
        CaseMember.CaseRole.SUPPORTING_INVESTIGATOR,
        CaseMember.CaseRole.SUPERVISOR,
        CaseMember.CaseRole.FORENSIC_OFFICER,
        CaseMember.CaseRole.PROSECUTOR,
        CaseMember.CaseRole.COURT_STAFF,
        CaseMember.CaseRole.JUDGE,
    },
    "upload": {
        CaseMember.CaseRole.LEAD_INVESTIGATOR,
        CaseMember.CaseRole.SUPPORTING_INVESTIGATOR,
        CaseMember.CaseRole.SUPERVISOR,
        CaseMember.CaseRole.FORENSIC_OFFICER,
    },
    "verify": {
        CaseMember.CaseRole.LEAD_INVESTIGATOR,
        CaseMember.CaseRole.SUPPORTING_INVESTIGATOR,
        CaseMember.CaseRole.SUPERVISOR,
        CaseMember.CaseRole.FORENSIC_OFFICER,
    },
}


def has_case_permission(user, case, permission):
    """
    Check whether a user has a specific permission within a case.
    """
    membership = CaseMember.objects.filter(
        case=case,
        user=user,
        is_active=True,
    ).first()

    if not membership:
        return False

    allowed_roles = DOCUMENT_PERMISSIONS.get(permission, set())

    return membership.case_role in allowed_roles

def get_permitted_case_roles(permission):
    """
    Return the case roles allowed for a specific permission.
    """
    return DOCUMENT_PERMISSIONS.get(permission, set())