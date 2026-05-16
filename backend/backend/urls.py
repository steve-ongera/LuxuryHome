"""
LuxuryHome – luxuryhome/urls.py
Root URL configuration.  All API routes live under /api/
and are handled by core/urls.py.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        "name":    "LuxuryHome API",
        "version": "1.0.0",
        "docs":    "/api/schema/",
        "status":  "online",
    })


urlpatterns = [
    # Django admin
    path("django-admin/", admin.site.urls),

    # API root info
    path("api/", api_root),

    # All app API routes
    path("api/", include("core.urls")),

    # API schema (drf-spectacular)
    path("api/schema/", include("drf_spectacular.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)