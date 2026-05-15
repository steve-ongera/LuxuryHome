"""
LuxuryHome – core/serializers.py
Single file containing every serializer for the platform.
"""

from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    User, EmailVerificationToken, PasswordResetToken,
    Amenity, Property, PropertyImage, PropertyReview, Favorite,
    QuoteRequest,
    Hotel, HotelImage, RoomType, SeasonalPricing, HotelBooking, HotelReview,
    Appointment, Notification, Payment,
    Testimonial, Partner, ContactMessage, SiteSettings,
)


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access":  str(refresh.access_token),
    }


# ─────────────────────────────────────────────────────────────
# USER / AUTH
# ─────────────────────────────────────────────────────────────

class UserPublicSerializer(serializers.ModelSerializer):
    """Minimal user info safe to embed in other serializers."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ["id", "full_name", "email", "phone", "avatar", "role"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserDetailSerializer(serializers.ModelSerializer):
    """Full user profile — only for the authenticated user or admin."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            "id", "email", "first_name", "last_name", "full_name",
            "phone", "role", "avatar", "bio",
            "is_verified", "date_joined", "updated_at",
        ]
        read_only_fields = ["id", "email", "role", "is_verified", "date_joined", "updated_at"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ["email", "first_name", "last_name", "phone", "password", "role"]

    def validate_role(self, value):
        # Guests cannot self-register as admin
        if value == "admin":
            raise serializers.ValidationError("Cannot register as admin.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is deactivated.")
        data["user"] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password.")
        return value


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token        = serializers.UUIDField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_token(self, value):
        try:
            obj = PasswordResetToken.objects.get(token=value, used=False)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired token.")
        if obj.is_expired():
            raise serializers.ValidationError("Token has expired.")
        self.context["reset_token"] = obj
        return value


class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField()   # Google ID token


# ─────────────────────────────────────────────────────────────
# AMENITY
# ─────────────────────────────────────────────────────────────

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Amenity
        fields = ["id", "name", "icon"]


# ─────────────────────────────────────────────────────────────
# PROPERTY
# ─────────────────────────────────────────────────────────────

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PropertyImage
        fields = ["id", "image", "caption", "order"]


class PropertyReviewSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)

    class Meta:
        model  = PropertyReview
        fields = ["id", "author", "rating", "comment", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views and cards."""
    amenities    = AmenitySerializer(many=True, read_only=True)
    agent        = UserPublicSerializer(read_only=True)
    is_favorited = serializers.SerializerMethodField()
    gallery_images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model  = Property
        fields = [
            "id", "title", "slug", "property_type", "status",
            "price", "currency", "price_on_request",
            "country", "county_state", "city", "exact_location",
            "latitude", "longitude",
            "bedrooms", "bathrooms", "size_sqft", "size_acres",
            "featured_image", "gallery_images",
            "amenities", "agent",
            "is_featured", "is_approved", "view_count",
            "created_at", "is_favorited",
        ]

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, property=obj).exists()
        return False


class PropertyDetailSerializer(PropertyListSerializer):
    """Full serializer for the property detail page."""
    reviews      = PropertyReviewSerializer(many=True, read_only=True)
    review_count = serializers.SerializerMethodField()
    avg_rating   = serializers.SerializerMethodField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "description", "year_built", "floors", "parking_spaces",
            "is_furnished", "video_tour_url",
            "seo_title", "seo_description", "seo_image",
            "updated_at", "reviews", "review_count", "avg_rating",
        ]

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    amenity_ids  = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), many=True, write_only=True, required=False, source="amenities"
    )
    gallery      = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model  = Property
        exclude = ["slug", "view_count", "created_at", "updated_at"]
        read_only_fields = ["id", "is_approved"]

    def validate(self, data):
        if not data.get("price_on_request") and not data.get("price"):
            raise serializers.ValidationError({"price": "Provide a price or mark as 'price on request'."})
        return data

    def create(self, validated_data):
        gallery = validated_data.pop("gallery", [])
        amenities = validated_data.pop("amenities", [])
        prop = Property.objects.create(**validated_data)
        prop.amenities.set(amenities)
        for img in gallery:
            PropertyImage.objects.create(property=prop, image=img)
        return prop

    def update(self, instance, validated_data):
        gallery   = validated_data.pop("gallery", [])
        amenities = validated_data.pop("amenities", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if amenities is not None:
            instance.amenities.set(amenities)
        for img in gallery:
            PropertyImage.objects.create(property=instance, image=img)
        return instance


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model  = Favorite
        fields = ["id", "property", "created_at"]


# ─────────────────────────────────────────────────────────────
# QUOTE REQUEST
# ─────────────────────────────────────────────────────────────

class QuoteRequestSerializer(serializers.ModelSerializer):
    """
    Used for public POST (no auth) and agent/admin GET/PATCH.
    The 'user' field is set automatically in the view if the
    request is authenticated.
    """
    property_title = serializers.SerializerMethodField(read_only=True)
    hotel_name     = serializers.SerializerMethodField(read_only=True)
    responded_by   = UserPublicSerializer(read_only=True)

    class Meta:
        model  = QuoteRequest
        fields = [
            "id", "property", "hotel",
            "full_name", "email", "phone", "budget",
            "inquiry_type", "message", "viewing_date",
            "user", "status", "agent_response",
            "responded_at", "responded_by",
            "created_at", "updated_at",
            "property_title", "hotel_name",
        ]
        read_only_fields = [
            "id", "user", "status", "agent_response",
            "responded_at", "responded_by", "created_at", "updated_at",
        ]

    def get_property_title(self, obj):
        return obj.property.title if obj.property else None

    def get_hotel_name(self, obj):
        return obj.hotel.name if obj.hotel else None

    def validate(self, data):
        if not data.get("property") and not data.get("hotel"):
            raise serializers.ValidationError(
                "A quote request must reference either a property or a hotel."
            )
        return data


class QuoteRespondSerializer(serializers.Serializer):
    message = serializers.CharField()

    def update(self, instance, validated_data):
        instance.agent_response = validated_data["message"]
        instance.status         = "responded"
        instance.responded_at   = timezone.now()
        instance.responded_by   = self.context["request"].user
        instance.save()
        return instance


# ─────────────────────────────────────────────────────────────
# HOTEL
# ─────────────────────────────────────────────────────────────

class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = HotelImage
        fields = ["id", "image", "caption", "order"]


class SeasonalPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SeasonalPricing
        fields = ["id", "name", "start_date", "end_date", "price_per_night"]


class RoomTypeSerializer(serializers.ModelSerializer):
    amenities        = AmenitySerializer(many=True, read_only=True)
    seasonal_prices  = SeasonalPricingSerializer(many=True, read_only=True)

    class Meta:
        model  = RoomType
        fields = [
            "id", "name", "description", "capacity", "beds",
            "size_sqm", "price_per_night", "total_units",
            "image", "amenities", "seasonal_prices", "is_available",
        ]


class HotelReviewSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)

    class Meta:
        model  = HotelReview
        fields = ["id", "author", "rating", "title", "comment", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class HotelListSerializer(serializers.ModelSerializer):
    amenities      = AmenitySerializer(many=True, read_only=True)
    gallery_images = HotelImageSerializer(many=True, read_only=True)
    owner          = UserPublicSerializer(read_only=True)
    avg_rating     = serializers.SerializerMethodField()

    class Meta:
        model  = Hotel
        fields = [
            "id", "name", "slug", "star_rating", "total_rooms",
            "country", "county_state", "city", "exact_location",
            "latitude", "longitude",
            "price_per_night", "currency",
            "featured_image", "gallery_images",
            "amenities", "owner",
            "is_featured", "is_active",
            "created_at", "avg_rating",
        ]

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class HotelDetailSerializer(HotelListSerializer):
    room_types = RoomTypeSerializer(many=True, read_only=True)
    reviews    = HotelReviewSerializer(many=True, read_only=True)

    class Meta(HotelListSerializer.Meta):
        fields = HotelListSerializer.Meta.fields + [
            "description", "room_types", "reviews",
            "seo_title", "seo_description", "seo_image", "updated_at",
        ]


class HotelCreateUpdateSerializer(serializers.ModelSerializer):
    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), many=True, write_only=True, required=False, source="amenities"
    )
    gallery = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model  = Hotel
        exclude = ["slug", "created_at", "updated_at"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        gallery   = validated_data.pop("gallery", [])
        amenities = validated_data.pop("amenities", [])
        hotel = Hotel.objects.create(**validated_data)
        hotel.amenities.set(amenities)
        for img in gallery:
            HotelImage.objects.create(hotel=hotel, image=img)
        return hotel

    def update(self, instance, validated_data):
        gallery   = validated_data.pop("gallery", [])
        amenities = validated_data.pop("amenities", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if amenities is not None:
            instance.amenities.set(amenities)
        for img in gallery:
            HotelImage.objects.create(hotel=instance, image=img)
        return instance


class HotelBookingSerializer(serializers.ModelSerializer):
    hotel_name    = serializers.SerializerMethodField(read_only=True)
    room_name     = serializers.SerializerMethodField(read_only=True)
    nights        = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = HotelBooking
        fields = [
            "id", "hotel", "room_type",
            "guest_name", "guest_email", "guest_phone", "user",
            "check_in", "check_out", "guests", "rooms",
            "total_price", "currency", "special_requests",
            "status", "created_at", "updated_at",
            "hotel_name", "room_name", "nights",
        ]
        read_only_fields = ["id", "user", "total_price", "status", "created_at", "updated_at"]

    def get_hotel_name(self, obj):
        return obj.hotel.name

    def get_room_name(self, obj):
        return obj.room_type.name

    def get_nights(self, obj):
        return obj.nights

    def validate(self, data):
        if data["check_in"] >= data["check_out"]:
            raise serializers.ValidationError({"check_out": "Check-out must be after check-in."})
        if data["check_in"] < timezone.now().date():
            raise serializers.ValidationError({"check_in": "Check-in cannot be in the past."})
        return data

    def create(self, validated_data):
        room     = validated_data["room_type"]
        nights   = (validated_data["check_out"] - validated_data["check_in"]).days
        rooms    = validated_data.get("rooms", 1)
        validated_data["total_price"] = room.price_per_night * nights * rooms
        validated_data["currency"]    = validated_data["hotel"].currency
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


# ─────────────────────────────────────────────────────────────
# APPOINTMENT
# ─────────────────────────────────────────────────────────────

class AppointmentSerializer(serializers.ModelSerializer):
    property_title = serializers.SerializerMethodField(read_only=True)
    agent_name     = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Appointment
        fields = [
            "id", "property", "agent",
            "client_name", "client_email", "client_phone", "user",
            "scheduled_at", "notes", "status",
            "created_at", "property_title", "agent_name",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def get_property_title(self, obj):
        return obj.property.title

    def get_agent_name(self, obj):
        return obj.agent.get_full_name()

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


# ─────────────────────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────────────────────

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ["id", "notif_type", "title", "message", "link", "is_read", "created_at"]
        read_only_fields = ["id", "notif_type", "title", "message", "link", "created_at"]


# ─────────────────────────────────────────────────────────────
# PAYMENT
# ─────────────────────────────────────────────────────────────

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = [
            "id", "user", "payment_type", "amount", "currency",
            "status", "phone_number", "mpesa_receipt",
            "checkout_request_id", "hotel_booking",
            "description", "created_at", "completed_at",
        ]
        read_only_fields = [
            "id", "user", "status", "mpesa_receipt",
            "checkout_request_id", "merchant_request_id",
            "created_at", "completed_at",
        ]


class MpesaSTKSerializer(serializers.Serializer):
    phone_number  = serializers.CharField(max_length=15)
    amount        = serializers.DecimalField(max_digits=14, decimal_places=2)
    hotel_booking = serializers.PrimaryKeyRelatedField(
        queryset=HotelBooking.objects.all(), required=False
    )
    description   = serializers.CharField(max_length=200, default="LuxuryHome Payment")

    def validate_phone_number(self, value):
        # Normalise to 254XXXXXXXXX
        value = value.strip().replace(" ", "").replace("+", "")
        if value.startswith("0"):
            value = "254" + value[1:]
        if not value.startswith("254") or len(value) != 12:
            raise serializers.ValidationError("Enter a valid Kenyan phone number.")
        return value


# ─────────────────────────────────────────────────────────────
# UTILITY / CMS
# ─────────────────────────────────────────────────────────────

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = ["id", "author_name", "author_role", "author_avatar", "content", "rating", "order"]


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Partner
        fields = ["id", "name", "logo", "website", "order"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteSettings
        exclude = ["id"]


# ─────────────────────────────────────────────────────────────
# ADMIN ANALYTICS
# ─────────────────────────────────────────────────────────────

class AdminAnalyticsSerializer(serializers.Serializer):
    total_properties  = serializers.IntegerField()
    total_hotels      = serializers.IntegerField()
    total_users       = serializers.IntegerField()
    total_agents      = serializers.IntegerField()
    total_quotes      = serializers.IntegerField()
    new_quotes_today  = serializers.IntegerField()
    total_bookings    = serializers.IntegerField()
    pending_approvals = serializers.IntegerField()
    total_revenue     = serializers.DecimalField(max_digits=18, decimal_places=2)
    recent_quotes     = QuoteRequestSerializer(many=True)
    recent_bookings   = HotelBookingSerializer(many=True)


class AgentAnalyticsSerializer(serializers.Serializer):
    total_listings    = serializers.IntegerField()
    active_listings   = serializers.IntegerField()
    total_inquiries   = serializers.IntegerField()
    new_inquiries     = serializers.IntegerField()
    total_views       = serializers.IntegerField()
    upcoming_appointments = AppointmentSerializer(many=True)
    recent_inquiries  = QuoteRequestSerializer(many=True)