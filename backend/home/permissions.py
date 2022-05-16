from rest_framework import permissions

class IsPostOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return request.user and request.user.is_authenticated


class IsGetOrPostOrIsAuthenticated(permissions.BasePermission):
    """
    Any requests other than GET or POST must be authenticated
    """

    def has_permission(self, request, view):
        if request.method == 'GET' or request.method == 'POST':
            return True

        return request.user and request.user.is_authenticated


class IsProfessional(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        if request.user.professional:
            return True
        return False

