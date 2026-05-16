"""
LuxuryHome – luxuryhome/urls.py
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def api_root(request):
    return JsonResponse({
        "name": "LuxuryHome API",
        "version": "1.0.0",
        "docs": "/api/docs/",
        "status": "online",
    })


urlpatterns = [
    # Django admin
    path("django-admin/", admin.site.urls),

    # API root info
    path("api/", api_root),

    # App routes
    path("api/", include("core.urls")),

    # Schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    # Swagger
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    # Redoc
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)