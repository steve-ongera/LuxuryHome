"""
LuxuryHome – luxuryhome/settings.py
Complete Django settings for the platform.
Load secrets from environment variables via django-environ.
"""

import os
from pathlib import Path
from datetime import timedelta
import environ

# ── Paths ─────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ── Environment ───────────────────────────────────────────
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

# ── Core ──────────────────────────────────────────────────
SECRET_KEY = env("SECRET_KEY", default="change-me-in-production-use-a-long-random-string")
DEBUG      = env("DEBUG", default=True)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1", "0.0.0.0"])

# ── Application Definition ────────────────────────────────
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "cloudinary",
    "cloudinary_storage",
]

LOCAL_APPS = [
    "core",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ── Middleware ────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",          # static files in production
    "corsheaders.middleware.CorsMiddleware",               # CORS — must be high up
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF     = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"

# ── Templates ─────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS":    [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ── Database ──────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ── Custom User Model ─────────────────────────────────────
AUTH_USER_MODEL = "core.User"

# ── Password Validation ───────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
     "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ──────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE     = "Africa/Nairobi"
USE_I18N      = True
USE_TZ        = True

# ── Static & Media ────────────────────────────────────────
STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL  = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ── Cloudinary (production media storage) ────────────────
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": env("CLOUDINARY_CLOUD_NAME", default=""),
    "API_KEY":    env("CLOUDINARY_API_KEY",    default=""),
    "API_SECRET": env("CLOUDINARY_API_SECRET", default=""),
}

# Use Cloudinary in production, local filesystem in development
if not DEBUG and env("CLOUDINARY_CLOUD_NAME", default=""):
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
else:
    DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── REST Framework ────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Throttling disabled for development (requires Redis in production)
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
}

# ── Simple JWT ────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=env.int("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", default=60)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env.int("JWT_REFRESH_TOKEN_LIFETIME_DAYS", default=7)),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN":      True,
    "ALGORITHM":              "HS256",
    "SIGNING_KEY":            SECRET_KEY,
    "AUTH_HEADER_TYPES":      ("Bearer",),
    "AUTH_TOKEN_CLASSES":     ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM":       "token_type",
}

# ── CORS ──────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept", "accept-encoding", "authorization",
    "content-type", "dnt", "origin",
    "user-agent", "x-csrftoken", "x-requested-with",
]

# ── DRF Spectacular (API Docs) ────────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE":       "LuxuryHome API",
    "DESCRIPTION": "Premium real estate platform REST API",
    "VERSION":     "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}

# ── Email ─────────────────────────────────────────────────
EMAIL_BACKEND     = env("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_HOST        = env("EMAIL_HOST",    default="smtp.gmail.com")
EMAIL_PORT        = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS     = True
EMAIL_HOST_USER   = env("EMAIL_HOST_USER",     default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="LuxuryHome <noreply@luxuryhome.com>")

# ── Celery (async tasks) ──────────────────────────────────
CELERY_BROKER_URL        = env("CELERY_BROKER_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND    = env("CELERY_RESULT_BACKEND", default="redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT    = ["json"]
CELERY_TASK_SERIALIZER   = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE          = TIME_ZONE

# ── Cache (locmem for dev — swap for Redis in production) ─
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# ── Session ───────────────────────────────────────────────
SESSION_ENGINE      = "django.contrib.sessions.backends.db"
SESSION_CACHE_ALIAS = "default"

# ── Google OAuth ──────────────────────────────────────────
GOOGLE_CLIENT_ID     = env("GOOGLE_CLIENT_ID",     default="")
GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET", default="")

# ── M-Pesa / Safaricom Daraja ─────────────────────────────
MPESA_CONSUMER_KEY    = env("MPESA_CONSUMER_KEY",    default="")
MPESA_CONSUMER_SECRET = env("MPESA_CONSUMER_SECRET", default="")
MPESA_SHORTCODE       = env("MPESA_SHORTCODE",       default="")
MPESA_PASSKEY         = env("MPESA_PASSKEY",         default="")
MPESA_CALLBACK_URL    = env("MPESA_CALLBACK_URL",    default="https://yourdomain.com/api/payments/mpesa/callback/")
MPESA_ENVIRONMENT     = env("MPESA_ENVIRONMENT",     default="sandbox")   # sandbox | production

# ── Frontend URL ──────────────────────────────────────────
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")

# ── Security (production) ─────────────────────────────────
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER        = True
    SECURE_CONTENT_TYPE_NOSNIFF      = True
    SECURE_HSTS_SECONDS               = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS    = True
    SECURE_HSTS_PRELOAD               = True
    SECURE_SSL_REDIRECT               = True
    SESSION_COOKIE_SECURE             = True
    CSRF_COOKIE_SECURE                = True
    X_FRAME_OPTIONS                   = "DENY"

# ── Logging ───────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class":     "logging.StreamHandler",
            "formatter": "verbose",
        },
        "file": {
            "class":     "logging.FileHandler",
            "filename":  BASE_DIR / "logs" / "django.log",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level":    "INFO",
    },
    "loggers": {
        "django": {
            "handlers":  ["console"],
            "level":     env("DJANGO_LOG_LEVEL", default="INFO"),
            "propagate": False,
        },
        "core": {
            "handlers":  ["console", "file"],
            "level":     "DEBUG",
            "propagate": False,
        },
    },
}

# ── Django Admin Customisation ────────────────────────────
ADMIN_SITE_HEADER = "LuxuryHome Administration"
ADMIN_SITE_TITLE  = "LuxuryHome Admin"
ADMIN_INDEX_TITLE = "Platform Management"


# ══════════════════════════════════════════════════════════
# PRODUCTION OVERRIDES
# When you're ready to deploy, set these in your .env:
#   DEBUG=False
#   REDIS_URL=redis://your-redis-host:6379/1
#   CELERY_BROKER_URL=redis://your-redis-host:6379/0
# Then replace CACHES with:
#   CACHES = {
#       "default": {
#           "BACKEND":  "django_redis.cache.RedisCache",
#           "LOCATION": env("REDIS_URL"),
#           "OPTIONS":  {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
#           "TIMEOUT":  300,
#       }
#   }
# And re-enable throttling in REST_FRAMEWORK:
#   "DEFAULT_THROTTLE_CLASSES": [
#       "rest_framework.throttling.AnonRateThrottle",
#       "rest_framework.throttling.UserRateThrottle",
#   ],
# And switch sessions back to cache:
#   SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# ══════════════════════════════════════════════════════════