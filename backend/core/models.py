"""
LuxuryHome – core/models.py
Single file containing every model for the platform.
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.text import slugify


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def property_image_path(instance, filename):
    return f"properties/{instance.property.slug}/{filename}"

def hotel_image_path(instance, filename):
    return f"hotels/{instance.hotel.slug}/{filename}"

def user_avatar_path(instance, filename):
    return f"avatars/{instance.id}/{filename}"

def unique_slug(model, base_slug):
    """Append numeric suffix until slug is unique for given model."""
    slug = base_slug
    counter = 1
    while model.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


# ─────────────────────────────────────────────────────────────
# USER
# ─────────────────────────────────────────────────────────────

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("role", "admin")
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("is_verified", True)
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("admin",       "Admin"),
        ("agent",       "Agent"),
        ("customer",    "Customer"),
        ("hotel_owner", "Hotel Owner"),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email         = models.EmailField(unique=True)
    first_name    = models.CharField(max_length=100)
    last_name     = models.CharField(max_length=100)
    phone         = models.CharField(max_length=30, blank=True)
    role          = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    avatar        = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    bio           = models.TextField(blank=True)

    # Auth flags
    is_active     = models.BooleanField(default=True)
    is_staff      = models.BooleanField(default=False)
    is_verified   = models.BooleanField(default=False)

    # Google OAuth
    google_id     = models.CharField(max_length=200, blank=True)

    # Timestamps
    date_joined   = models.DateTimeField(default=timezone.now)
    updated_at    = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        db_table  = "lh_users"
        ordering  = ["-date_joined"]
        verbose_name = "User"

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_admin(self):
        return self.role == "admin"

    @property
    def is_agent(self):
        return self.role in ("agent", "admin")


class EmailVerificationToken(models.Model):
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name="verification_token")
    token      = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_email_verification_tokens"

    def is_expired(self):
        return (timezone.now() - self.created_at).total_seconds() > 86400  # 24 hrs


class PasswordResetToken(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token      = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used       = models.BooleanField(default=False)

    class Meta:
        db_table = "lh_password_reset_tokens"

    def is_expired(self):
        return (timezone.now() - self.created_at).total_seconds() > 3600  # 1 hr


# ─────────────────────────────────────────────────────────────
# PROPERTY
# ─────────────────────────────────────────────────────────────

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    class Meta:
        db_table  = "lh_amenities"
        ordering  = ["name"]
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name


class Property(models.Model):
    TYPE_CHOICES = [
        ("mansion",    "Mansion"),
        ("villa",      "Villa"),
        ("apartment",  "Luxury Apartment"),
        ("land",       "Land"),
        ("hotel",      "Hotel & Resort"),
        ("beach",      "Beach Property"),
        ("commercial", "Commercial"),
        ("investment", "Investment Property"),
    ]
    STATUS_CHOICES = [
        ("sale",   "For Sale"),
        ("rent",   "For Rent"),
        ("sold",   "Sold"),
        ("leased", "Leased"),
        ("off_market", "Off Market"),
    ]
    CURRENCY_CHOICES = [
        ("KES", "Kenyan Shilling"),
        ("USD", "US Dollar"),
        ("EUR", "Euro"),
        ("GBP", "British Pound"),
    ]

    # Identity
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title         = models.CharField(max_length=255)
    slug          = models.SlugField(max_length=280, unique=True, blank=True)
    property_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default="sale")

    # Content
    description   = models.TextField()
    price         = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    currency      = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="KES")
    price_on_request = models.BooleanField(default=False)

    # Location
    country       = models.CharField(max_length=100, default="Kenya")
    county_state  = models.CharField(max_length=100, blank=True)
    city          = models.CharField(max_length=100)
    exact_location = models.CharField(max_length=255, blank=True)
    latitude      = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude     = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Specs
    bedrooms      = models.PositiveIntegerField(null=True, blank=True)
    bathrooms     = models.PositiveIntegerField(null=True, blank=True)
    size_sqft     = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    size_acres    = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    year_built    = models.PositiveIntegerField(null=True, blank=True)
    floors        = models.PositiveIntegerField(null=True, blank=True)
    parking_spaces = models.PositiveIntegerField(null=True, blank=True)
    is_furnished  = models.BooleanField(null=True, blank=True)

    # Media
    featured_image = models.ImageField(upload_to="properties/featured/", null=True, blank=True)
    video_tour_url = models.URLField(blank=True)

    # Relations
    amenities     = models.ManyToManyField(Amenity, blank=True, related_name="properties")
    agent         = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="listings", limit_choices_to={"role__in": ["agent", "admin"]}
    )

    # SEO
    seo_title       = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)
    seo_image       = models.ImageField(upload_to="properties/seo/", null=True, blank=True)

    # Flags
    is_featured   = models.BooleanField(default=False)
    is_approved   = models.BooleanField(default=False)
    is_active     = models.BooleanField(default=True)
    view_count    = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table  = "lh_properties"
        ordering  = ["-is_featured", "-created_at"]
        verbose_name_plural = "Properties"
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["property_type", "status"]),
            models.Index(fields=["city", "country"]),
            models.Index(fields=["is_featured", "is_approved", "is_active"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            self.slug = unique_slug(Property, base)
        if not self.seo_title:
            self.seo_title = self.title[:70]
        if not self.seo_description:
            self.seo_description = self.description[:160]
        super().save(*args, **kwargs)

    def increment_views(self):
        Property.objects.filter(pk=self.pk).update(view_count=models.F("view_count") + 1)


class PropertyImage(models.Model):
    property  = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="gallery_images")
    image     = models.ImageField(upload_to=property_image_path)
    caption   = models.CharField(max_length=200, blank=True)
    order     = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_property_images"
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"Image for {self.property.title}"


class PropertyReview(models.Model):
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="reviews")
    author     = models.ForeignKey(User, on_delete=models.CASCADE, related_name="property_reviews")
    rating     = models.PositiveSmallIntegerField()   # 1–5
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_property_reviews"
        unique_together = ("property", "author")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author.get_full_name()} → {self.property.title} ({self.rating}★)"


class Favorite(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_favorites"
        unique_together = ("user", "property")

    def __str__(self):
        return f"{self.user.email} ♥ {self.property.title}"


# ─────────────────────────────────────────────────────────────
# QUOTE / INQUIRY
# ─────────────────────────────────────────────────────────────

class QuoteRequest(models.Model):
    INQUIRY_CHOICES = [
        ("quote",      "Price Quotation"),
        ("viewing",    "Schedule Viewing"),
        ("financing",  "Financing Info"),
        ("negotiate",  "Negotiate Price"),
        ("general",    "General Enquiry"),
    ]
    STATUS_CHOICES = [
        ("new",         "New"),
        ("in_progress", "In Progress"),
        ("responded",   "Responded"),
        ("closed",      "Closed"),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Target – either property or hotel (or neither for general contact)
    property      = models.ForeignKey(
        Property, on_delete=models.SET_NULL, null=True, blank=True, related_name="quotes"
    )
    hotel         = models.ForeignKey(
        "Hotel", on_delete=models.SET_NULL, null=True, blank=True, related_name="quotes"
    )

    # Submitter info — NO authentication required
    full_name     = models.CharField(max_length=200)
    email         = models.EmailField()
    phone         = models.CharField(max_length=30)
    budget        = models.CharField(max_length=100, blank=True)
    inquiry_type  = models.CharField(max_length=20, choices=INQUIRY_CHOICES, default="quote")
    message       = models.TextField()
    viewing_date  = models.DateField(null=True, blank=True)

    # Linked user (optional — set if submitter was logged in)
    user          = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="quote_requests"
    )

    # Status & response
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    agent_response = models.TextField(blank=True)
    responded_at  = models.DateTimeField(null=True, blank=True)
    responded_by  = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="responded_quotes"
    )

    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "lh_quote_requests"
        ordering = ["-created_at"]
        indexes  = [models.Index(fields=["status", "created_at"])]

    def __str__(self):
        target = self.property.title if self.property else (self.hotel.name if self.hotel else "General")
        return f"{self.full_name} → {target} [{self.status}]"


# ─────────────────────────────────────────────────────────────
# HOTEL
# ─────────────────────────────────────────────────────────────

class Hotel(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name          = models.CharField(max_length=255)
    slug          = models.SlugField(max_length=280, unique=True, blank=True)
    description   = models.TextField()
    star_rating   = models.PositiveSmallIntegerField(default=3)   # 1–5
    total_rooms   = models.PositiveIntegerField(default=0)

    # Location
    country       = models.CharField(max_length=100, default="Kenya")
    county_state  = models.CharField(max_length=100, blank=True)
    city          = models.CharField(max_length=100)
    exact_location = models.CharField(max_length=255, blank=True)
    latitude      = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude     = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Pricing
    price_per_night = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency        = models.CharField(max_length=3, default="KES")

    # Media
    featured_image  = models.ImageField(upload_to="hotels/featured/", null=True, blank=True)

    # Relations
    amenities     = models.ManyToManyField(Amenity, blank=True, related_name="hotels")
    owner         = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="hotels", limit_choices_to={"role__in": ["hotel_owner", "admin"]}
    )

    # SEO
    seo_title       = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)
    seo_image       = models.ImageField(upload_to="hotels/seo/", null=True, blank=True)

    # Flags
    is_featured   = models.BooleanField(default=False)
    is_active     = models.BooleanField(default=True)

    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "lh_hotels"
        ordering = ["-is_featured", "-star_rating"]
        indexes  = [models.Index(fields=["slug"]), models.Index(fields=["city", "country"])]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            self.slug = unique_slug(Hotel, base)
        if not self.seo_title:
            self.seo_title = self.name[:70]
        if not self.seo_description:
            self.seo_description = self.description[:160]
        super().save(*args, **kwargs)


class HotelImage(models.Model):
    hotel      = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="gallery_images")
    image      = models.ImageField(upload_to=hotel_image_path)
    caption    = models.CharField(max_length=200, blank=True)
    order      = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_hotel_images"
        ordering = ["order", "created_at"]


class RoomType(models.Model):
    hotel       = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="room_types")
    name        = models.CharField(max_length=100)           # e.g. "Deluxe Ocean Suite"
    description = models.TextField(blank=True)
    capacity    = models.PositiveIntegerField(default=2)     # max guests
    beds        = models.PositiveIntegerField(default=1)
    size_sqm    = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    price_per_night = models.DecimalField(max_digits=12, decimal_places=2)
    total_units = models.PositiveIntegerField(default=1)
    image       = models.ImageField(upload_to="hotels/rooms/", null=True, blank=True)
    amenities   = models.ManyToManyField(Amenity, blank=True, related_name="room_types")
    is_available = models.BooleanField(default=True)

    class Meta:
        db_table = "lh_room_types"
        ordering = ["price_per_night"]

    def __str__(self):
        return f"{self.hotel.name} – {self.name}"


class SeasonalPricing(models.Model):
    room_type   = models.ForeignKey(RoomType, on_delete=models.CASCADE, related_name="seasonal_prices")
    name        = models.CharField(max_length=100)   # e.g. "High Season"
    start_date  = models.DateField()
    end_date    = models.DateField()
    price_per_night = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "lh_seasonal_pricing"
        ordering = ["start_date"]


class HotelBooking(models.Model):
    STATUS_CHOICES = [
        ("pending",   "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hotel       = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="bookings")
    room_type   = models.ForeignKey(RoomType, on_delete=models.CASCADE, related_name="bookings")

    # Guest info
    guest_name  = models.CharField(max_length=200)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=30)
    user        = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="hotel_bookings"
    )

    # Booking details
    check_in    = models.DateField()
    check_out   = models.DateField()
    guests      = models.PositiveIntegerField(default=1)
    rooms       = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    currency    = models.CharField(max_length=3, default="KES")
    special_requests = models.TextField(blank=True)

    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "lh_hotel_bookings"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.guest_name} @ {self.hotel.name} ({self.check_in} → {self.check_out})"

    @property
    def nights(self):
        return (self.check_out - self.check_in).days


class HotelReview(models.Model):
    hotel      = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="reviews")
    author     = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hotel_reviews")
    rating     = models.PositiveSmallIntegerField()   # 1–5
    title      = models.CharField(max_length=150, blank=True)
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_hotel_reviews"
        unique_together = ("hotel", "author")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author.get_full_name()} → {self.hotel.name} ({self.rating}★)"


# ─────────────────────────────────────────────────────────────
# AGENT APPOINTMENT
# ─────────────────────────────────────────────────────────────

class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending",   "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property    = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="appointments")
    agent       = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="agent_appointments",
        limit_choices_to={"role__in": ["agent", "admin"]}
    )
    client_name  = models.CharField(max_length=200)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=30)
    user         = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="client_appointments"
    )
    scheduled_at = models.DateTimeField()
    notes        = models.TextField(blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_appointments"
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.client_name} – {self.property.title} @ {self.scheduled_at:%Y-%m-%d %H:%M}"


# ─────────────────────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────────────────────

class Notification(models.Model):
    TYPE_CHOICES = [
        ("quote",       "New Quote Request"),
        ("booking",     "New Booking"),
        ("appointment", "New Appointment"),
        ("approval",    "Property Approved"),
        ("rejection",   "Property Rejected"),
        ("review",      "New Review"),
        ("system",      "System Notice"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient   = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    notif_type  = models.CharField(max_length=20, choices=TYPE_CHOICES, default="system")
    title       = models.CharField(max_length=255)
    message     = models.TextField()
    link        = models.CharField(max_length=255, blank=True)
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_notifications"
        ordering = ["-created_at"]
        indexes  = [models.Index(fields=["recipient", "is_read"])]

    def __str__(self):
        return f"[{self.notif_type}] → {self.recipient.email}: {self.title}"


# ─────────────────────────────────────────────────────────────
# PAYMENT (M-PESA)
# ─────────────────────────────────────────────────────────────

class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending",   "Pending"),
        ("completed", "Completed"),
        ("failed",    "Failed"),
        ("refunded",  "Refunded"),
    ]
    TYPE_CHOICES = [
        ("booking",  "Hotel Booking"),
        ("deposit",  "Property Deposit"),
        ("service",  "Service Fee"),
    ]

    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    payment_type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount              = models.DecimalField(max_digits=14, decimal_places=2)
    currency            = models.CharField(max_length=3, default="KES")
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # M-Pesa specific
    phone_number        = models.CharField(max_length=20, blank=True)
    mpesa_receipt       = models.CharField(max_length=100, blank=True)
    checkout_request_id = models.CharField(max_length=200, blank=True)
    merchant_request_id = models.CharField(max_length=200, blank=True)

    # References
    hotel_booking = models.OneToOneField(
        HotelBooking, on_delete=models.SET_NULL, null=True, blank=True, related_name="payment"
    )

    description  = models.TextField(blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "lh_payments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.payment_type} – {self.amount} {self.currency} [{self.status}]"


# ─────────────────────────────────────────────────────────────
# UTILITY / CMS
# ─────────────────────────────────────────────────────────────

class Testimonial(models.Model):
    author_name  = models.CharField(max_length=150)
    author_role  = models.CharField(max_length=150, blank=True)
    author_avatar = models.ImageField(upload_to="testimonials/", null=True, blank=True)
    content      = models.TextField()
    rating       = models.PositiveSmallIntegerField(default=5)
    is_active    = models.BooleanField(default=True)
    order        = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_testimonials"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.author_name}: {self.content[:60]}…"


class Partner(models.Model):
    name       = models.CharField(max_length=150)
    logo       = models.ImageField(upload_to="partners/")
    website    = models.URLField(blank=True)
    is_active  = models.BooleanField(default=True)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "lh_partners"
        ordering = ["order"]

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    name       = models.CharField(max_length=200)
    email      = models.EmailField()
    phone      = models.CharField(max_length=30, blank=True)
    subject    = models.CharField(max_length=255)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lh_contact_messages"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} – {self.subject}"


class SiteSettings(models.Model):
    """Singleton model — only one row should ever exist."""
    site_name        = models.CharField(max_length=100, default="LuxuryHome")
    tagline          = models.CharField(max_length=255, blank=True)
    meta_title       = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    og_image         = models.ImageField(upload_to="seo/", null=True, blank=True)
    google_analytics_id = models.CharField(max_length=50, blank=True)
    whatsapp_number  = models.CharField(max_length=30, blank=True)
    contact_email    = models.EmailField(blank=True)
    contact_phone    = models.CharField(max_length=30, blank=True)
    address          = models.TextField(blank=True)
    facebook_url     = models.URLField(blank=True)
    instagram_url    = models.URLField(blank=True)
    twitter_url      = models.URLField(blank=True)
    linkedin_url     = models.URLField(blank=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = "lh_site_settings"
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return f"{self.site_name} Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj