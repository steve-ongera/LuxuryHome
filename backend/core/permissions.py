"""
LuxuryHome – core/permissions.py
Custom DRF permission classes.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminRole(BasePermission):
    """Allow access only to users with role='admin'."""
    message = "Admin access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsAgentOrAdmin(BasePermission):
    """Allow agents and admins."""
    message = "Agent or admin access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("agent", "admin")
        )


class IsHotelOwnerOrAdmin(BasePermission):
    """Allow hotel owners and admins."""
    message = "Hotel owner or admin access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("hotel_owner", "admin")
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level: allow the agent who owns the listing or an admin.
    Works for Property objects that have an `agent` field.
    """
    message = "You do not have permission to modify this resource."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == "admin":
            return True
        # Property → agent field
        if hasattr(obj, "agent"):
            return obj.agent == request.user
        # Hotel → owner field
        if hasattr(obj, "owner"):
            return obj.owner == request.user
        return False


class IsAuthenticatedOrReadOnly(BasePermission):
    """Read access for all; write access only for authenticated users."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated