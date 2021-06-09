from rest_framework import permissions

class CustomUserPermission(permissions.BasePermission):
    """
    Object-level permission allowing visitors to register user accounts
    and restricting updates to owners of the user accounts
    """

    def has_object_permission(self, request, view, obj):
        
        if request.method == 'POST':
            return True
        elif request.method =='PUT':
            return obj == request.user
        else:
            return False