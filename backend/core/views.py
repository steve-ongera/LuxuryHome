"""
LuxuryHome – core/views.py
Single file containing every view for the platform.
"""

from django.utils import timezone
from django.db.models import Q, Avg, Count, Sum
from django.shortcuts import get_object_or_404

from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    User, EmailVerificationToken, PasswordResetToken,
    Amenity, Property, PropertyImage, PropertyReview, Favorite,
    QuoteRequest,
    Hotel, HotelImage, RoomType, SeasonalPricing, HotelBooking, HotelReview,
    Appointment, Notification, Payment,
    Testimonial, Partner, ContactMessage, SiteSettings,
)
from .serializers import (
    UserDetailSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,
    GoogleAuthSerializer,
    AmenitySerializer,
    PropertyListSerializer, PropertyDetailSerializer,
    PropertyCreateUpdateSerializer, PropertyReviewSerializer, FavoriteSerializer,
    QuoteRequestSerializer, QuoteRespondSerializer,
    HotelListSerializer, HotelDetailSerializer, HotelCreateUpdateSerializer,
    RoomTypeSerializer, HotelBookingSerializer, HotelReviewSerializer,
    AppointmentSerializer,
    NotificationSerializer,
    PaymentSerializer, MpesaSTKSerializer,
    TestimonialSerializer, PartnerSerializer,
    ContactMessageSerializer, SiteSettingsSerializer,
    AdminAnalyticsSerializer, AgentAnalyticsSerializer,
    get_tokens,
)
from .permissions import IsAdminRole, IsAgentOrAdmin, IsOwnerOrAdmin, IsHotelOwnerOrAdmin


# ─────────────────────────────────────────────────────────────
# MIXINS
# ─────────────────────────────────────────────────────────────

class MultiSerializerMixin:
    """Choose serializer class based on action."""
    serializer_classes = {}

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)


# ─────────────────────────────────────────────────────────────
# AUTH VIEWS
# ─────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send verification email (async via Celery in production)
        token = EmailVerificationToken.objects.create(user=user)
        # TODO: send_verification_email.delay(user.email, str(token.token))

        tokens = get_tokens(user)
        return Response(
            {"detail": "Account created. Please verify your email.", **tokens},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens(user)
        user_data = UserDetailSerializer(user, context={"request": request}).data
        return Response({"user": user_data, **tokens})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass
        return Response({"detail": "Logged out."})


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = UserDetailSerializer
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated."})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            token = PasswordResetToken.objects.create(user=user)
            # TODO: send_password_reset_email.delay(user.email, str(token.token))
        except User.DoesNotExist:
            pass   # Don't reveal whether email exists
        return Response({"detail": "If that email exists, a reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reset_token = serializer.context["reset_token"]
        reset_token.user.set_password(serializer.validated_data["new_password"])
        reset_token.user.save()
        reset_token.used = True
        reset_token.save()
        return Response({"detail": "Password has been reset."})


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token_value = request.data.get("token")
        token = get_object_or_404(EmailVerificationToken, token=token_value)
        if token.is_expired():
            return Response({"detail": "Token expired."}, status=status.HTTP_400_BAD_REQUEST)
        token.user.is_verified = True
        token.user.save()
        token.delete()
        return Response({"detail": "Email verified."})


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_token = serializer.validated_data["token"]

        # Verify token with Google
        try:
            from google.oauth2 import id_token as google_id_token
            from google.auth.transport import requests as google_requests
            import os
            idinfo = google_id_token.verify_oauth2_token(
                id_token,
                google_requests.Request(),
                os.environ.get("GOOGLE_CLIENT_ID"),
            )
        except Exception:
            return Response({"detail": "Invalid Google token."}, status=status.HTTP_400_BAD_REQUEST)

        email     = idinfo["email"]
        google_id = idinfo["sub"]
        first     = idinfo.get("given_name", "")
        last      = idinfo.get("family_name", "")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first,
                "last_name": last,
                "google_id": google_id,
                "is_verified": True,
            },
        )
        if not created and not user.google_id:
            user.google_id = google_id
            user.save()

        tokens    = get_tokens(user)
        user_data = UserDetailSerializer(user, context={"request": request}).data
        return Response({"user": user_data, **tokens})


# ─────────────────────────────────────────────────────────────
# PROPERTY VIEWS
# ─────────────────────────────────────────────────────────────

class PropertyListCreateView(generics.ListCreateAPIView):
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["property_type", "status", "city", "country", "bedrooms", "bathrooms",
                        "is_featured", "is_approved", "currency"]
    search_fields    = ["title", "description", "city", "country", "exact_location"]
    ordering_fields  = ["price", "created_at", "view_count", "is_featured"]
    ordering         = ["-is_featured", "-created_at"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsAgentOrAdmin()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PropertyCreateUpdateSerializer
        return PropertyListSerializer

    def get_queryset(self):
        qs = Property.objects.select_related("agent").prefetch_related("amenities", "gallery_images")

        # Non-admins only see approved & active listings
        if not (self.request.user.is_authenticated and self.request.user.is_agent):
            qs = qs.filter(is_approved=True, is_active=True)

        # Price range
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        return qs

    def perform_create(self, serializer):
        # Auto-approve if admin, else pending
        is_approved = self.request.user.role == "admin"
        serializer.save(agent=self.request.user, is_approved=is_approved)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "slug"
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return PropertyCreateUpdateSerializer
        return PropertyDetailSerializer

    def get_queryset(self):
        return Property.objects.select_related("agent").prefetch_related(
            "amenities", "gallery_images", "reviews__author"
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class FeaturedPropertiesView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer

    def get_queryset(self):
        return Property.objects.filter(
            is_featured=True, is_approved=True, is_active=True
        ).select_related("agent").prefetch_related("amenities", "gallery_images")[:12]


class TrendingPropertiesView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer

    def get_queryset(self):
        return Property.objects.filter(
            is_approved=True, is_active=True
        ).order_by("-view_count")[:8]


class RecentPropertiesView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer

    def get_queryset(self):
        return Property.objects.filter(
            is_approved=True, is_active=True
        ).order_by("-created_at")[:8]


class PropertyToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        prop = get_object_or_404(Property, slug=slug)
        fav, created = Favorite.objects.get_or_create(user=request.user, property=prop)
        if not created:
            fav.delete()
            return Response({"favorited": False})
        return Response({"favorited": True}, status=status.HTTP_201_CREATED)


class PropertyFavoritesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related("property")


class PropertyTrackViewView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, slug):
        prop = get_object_or_404(Property, slug=slug)
        prop.increment_views()
        return Response({"detail": "View tracked."})


class PropertyApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        prop = get_object_or_404(Property, pk=pk)
        prop.is_approved = True
        prop.save()
        Notification.objects.create(
            recipient=prop.agent,
            notif_type="approval",
            title="Property Approved",
            message=f'Your listing "{prop.title}" has been approved.',
            link=f"/properties/{prop.slug}",
        )
        return Response({"detail": "Property approved."})


class PropertyRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        prop = get_object_or_404(Property, pk=pk)
        reason = request.data.get("reason", "")
        prop.is_approved = False
        prop.is_active   = False
        prop.save()
        Notification.objects.create(
            recipient=prop.agent,
            notif_type="rejection",
            title="Property Rejected",
            message=f'Your listing "{prop.title}" was not approved. Reason: {reason}',
        )
        return Response({"detail": "Property rejected."})


class PropertyReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        prop = get_object_or_404(Property, slug=self.kwargs["slug"])
        return PropertyReview.objects.filter(property=prop).select_related("author")

    def perform_create(self, serializer):
        prop = get_object_or_404(Property, slug=self.kwargs["slug"])
        serializer.save(property=prop, author=self.request.user)


class PropertyCompareView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        slugs = request.data.get("slugs", [])
        if len(slugs) > 4:
            return Response({"detail": "Compare up to 4 properties."}, status=400)
        props = Property.objects.filter(slug__in=slugs, is_approved=True, is_active=True)
        serializer = PropertyDetailSerializer(props, many=True, context={"request": request})
        return Response(serializer.data)


class PropertySEOView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        prop = get_object_or_404(Property, slug=slug)
        return Response({
            "seo_title":       prop.seo_title or prop.title,
            "seo_description": prop.seo_description or prop.description[:160],
            "seo_image":       request.build_absolute_uri(prop.seo_image.url) if prop.seo_image else None,
            "canonical":       f"https://luxuryhome.com/properties/{prop.slug}",
        })


# ─────────────────────────────────────────────────────────────
# QUOTE VIEWS
# ─────────────────────────────────────────────────────────────

class QuoteRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = QuoteRequestSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]   # NO AUTH REQUIRED FOR QUOTE SUBMISSION
        return [IsAuthenticated(), IsAgentOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return QuoteRequest.objects.all().select_related("property", "hotel", "user", "responded_by")
        # Agent sees quotes for their listings only
        return QuoteRequest.objects.filter(
            property__agent=user
        ).select_related("property", "hotel", "user", "responded_by")

    def perform_create(self, serializer):
        # Attach user if authenticated
        user = self.request.user if self.request.user.is_authenticated else None
        quote = serializer.save(user=user)

        # Notify the listing agent (or all admins if no agent)
        if quote.property and quote.property.agent:
            Notification.objects.create(
                recipient  = quote.property.agent,
                notif_type = "quote",
                title      = "New Quote Request",
                message    = f"{quote.full_name} requested a quote for '{quote.property.title}'.",
                link       = f"/dashboard/agent?tab=inquiries",
            )
        else:
            for admin in User.objects.filter(role="admin"):
                Notification.objects.create(
                    recipient  = admin,
                    notif_type = "quote",
                    title      = "New Quote Request",
                    message    = f"{quote.full_name} sent a general enquiry.",
                )


class QuoteRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAgentOrAdmin]
    serializer_class   = QuoteRequestSerializer
    queryset           = QuoteRequest.objects.all()


class QuoteRespondView(APIView):
    permission_classes = [IsAuthenticated, IsAgentOrAdmin]

    def post(self, request, pk):
        quote = get_object_or_404(QuoteRequest, pk=pk)
        serializer = QuoteRespondSerializer(
            quote, data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(quote, serializer.validated_data)
        return Response({"detail": "Response sent."})


class MyQuotesView(generics.ListAPIView):
    """Quotes submitted by the authenticated user."""
    permission_classes = [IsAuthenticated]
    serializer_class   = QuoteRequestSerializer

    def get_queryset(self):
        return QuoteRequest.objects.filter(
            user=self.request.user
        ).select_related("property", "hotel")


# ─────────────────────────────────────────────────────────────
# HOTEL VIEWS
# ─────────────────────────────────────────────────────────────

class HotelListCreateView(generics.ListCreateAPIView):
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["city", "country", "star_rating", "is_featured"]
    search_fields    = ["name", "description", "city", "country"]
    ordering_fields  = ["price_per_night", "star_rating", "created_at"]
    ordering         = ["-is_featured", "-star_rating"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsHotelOwnerOrAdmin()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return HotelCreateUpdateSerializer
        return HotelListSerializer

    def get_queryset(self):
        return Hotel.objects.filter(is_active=True).select_related("owner").prefetch_related(
            "amenities", "gallery_images"
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class HotelDetailView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field   = "slug"
    queryset       = Hotel.objects.all().prefetch_related(
        "amenities", "gallery_images", "room_types__amenities",
        "room_types__seasonal_prices", "reviews__author",
    )
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [IsAuthenticated(), IsHotelOwnerOrAdmin()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return HotelCreateUpdateSerializer
        return HotelDetailSerializer


class HotelFeaturedView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = HotelListSerializer

    def get_queryset(self):
        return Hotel.objects.filter(is_featured=True, is_active=True)[:8]


class HotelRoomListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = RoomTypeSerializer

    def get_queryset(self):
        hotel = get_object_or_404(Hotel, slug=self.kwargs["slug"])
        return RoomType.objects.filter(hotel=hotel, is_available=True).prefetch_related(
            "amenities", "seasonal_prices"
        )


class HotelAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        hotel     = get_object_or_404(Hotel, slug=slug)
        check_in  = request.query_params.get("check_in")
        check_out = request.query_params.get("check_out")

        if not check_in or not check_out:
            return Response({"detail": "Provide check_in and check_out."}, status=400)

        # Find conflicting bookings for this hotel
        conflicting = HotelBooking.objects.filter(
            hotel=hotel,
            status__in=["pending", "confirmed"],
            check_in__lt=check_out,
            check_out__gt=check_in,
        ).values_list("room_type_id", flat=True)

        rooms = RoomType.objects.filter(hotel=hotel, is_available=True).exclude(id__in=conflicting)
        serializer = RoomTypeSerializer(rooms, many=True, context={"request": request})
        return Response(serializer.data)


class HotelBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = HotelBookingSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated(), IsHotelOwnerOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return HotelBooking.objects.all().select_related("hotel", "room_type", "user")
        return HotelBooking.objects.filter(
            hotel__owner=user
        ).select_related("hotel", "room_type", "user")


class MyHotelBookingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = HotelBookingSerializer

    def get_queryset(self):
        return HotelBooking.objects.filter(
            user=self.request.user
        ).select_related("hotel", "room_type")


class HotelReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = HotelReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        hotel = get_object_or_404(Hotel, slug=self.kwargs["slug"])
        return HotelReview.objects.filter(hotel=hotel).select_related("author")

    def perform_create(self, serializer):
        hotel = get_object_or_404(Hotel, slug=self.kwargs["slug"])
        serializer.save(hotel=hotel, author=self.request.user)


# ─────────────────────────────────────────────────────────────
# APPOINTMENT VIEWS
# ─────────────────────────────────────────────────────────────

class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin",):
            return Appointment.objects.all().select_related("property", "agent", "user")
        if user.role == "agent":
            return Appointment.objects.filter(agent=user).select_related("property", "agent", "user")
        return Appointment.objects.filter(user=user).select_related("property", "agent")


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(
            Q(agent=self.request.user) | Q(user=self.request.user)
        )


# ─────────────────────────────────────────────────────────────
# NOTIFICATION VIEWS
# ─────────────────────────────────────────────────────────────

class NotificationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"detail": "All notifications marked as read."})


class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"count": count})


# ─────────────────────────────────────────────────────────────
# PAYMENT VIEWS
# ─────────────────────────────────────────────────────────────

class MpesaSTKPushView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MpesaSTKSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # TODO: Integrate Safaricom Daraja API
        # from .mpesa import initiate_stk_push
        # result = initiate_stk_push(data["phone_number"], data["amount"], data["description"])

        payment = Payment.objects.create(
            user           = request.user if request.user.is_authenticated else None,
            payment_type   = "booking" if data.get("hotel_booking") else "service",
            amount         = data["amount"],
            phone_number   = data["phone_number"],
            hotel_booking  = data.get("hotel_booking"),
            description    = data.get("description", ""),
            status         = "pending",
        )
        return Response({
            "detail":     "STK push sent. Awaiting confirmation.",
            "payment_id": str(payment.id),
        }, status=status.HTTP_201_CREATED)


class MpesaCallbackView(APIView):
    """Receives callback from Safaricom Daraja."""
    permission_classes = [AllowAny]

    def post(self, request):
        body = request.data.get("Body", {})
        result = body.get("stkCallback", {})
        result_code = result.get("ResultCode")
        checkout_request_id = result.get("CheckoutRequestID", "")

        try:
            payment = Payment.objects.get(checkout_request_id=checkout_request_id)
        except Payment.DoesNotExist:
            return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

        if result_code == 0:
            items = {
                item["Name"]: item.get("Value")
                for item in result.get("CallbackMetadata", {}).get("Item", [])
            }
            payment.status        = "completed"
            payment.mpesa_receipt = items.get("MpesaReceiptNumber", "")
            payment.completed_at  = timezone.now()
            if payment.hotel_booking:
                payment.hotel_booking.status = "confirmed"
                payment.hotel_booking.save()
        else:
            payment.status = "failed"

        payment.save()
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class MpesaStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, checkout_request_id):
        payment = get_object_or_404(Payment, checkout_request_id=checkout_request_id)
        return Response(PaymentSerializer(payment).data)


# ─────────────────────────────────────────────────────────────
# ADMIN VIEWS
# ─────────────────────────────────────────────────────────────

class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        today = timezone.now().date()
        data  = {
            "total_properties":  Property.objects.count(),
            "total_hotels":      Hotel.objects.count(),
            "total_users":       User.objects.count(),
            "total_agents":      User.objects.filter(role="agent").count(),
            "total_quotes":      QuoteRequest.objects.count(),
            "new_quotes_today":  QuoteRequest.objects.filter(created_at__date=today).count(),
            "total_bookings":    HotelBooking.objects.count(),
            "pending_approvals": Property.objects.filter(is_approved=False, is_active=True).count(),
            "total_revenue":     Payment.objects.filter(status="completed").aggregate(
                                     total=Sum("amount"))["total"] or 0,
            "recent_quotes":     QuoteRequest.objects.order_by("-created_at")[:5],
            "recent_bookings":   HotelBooking.objects.order_by("-created_at")[:5],
        }
        serializer = AdminAnalyticsSerializer(data)
        return Response(serializer.data)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class   = UserDetailSerializer
    filter_backends    = [filters.SearchFilter, DjangoFilterBackend]
    search_fields      = ["email", "first_name", "last_name", "phone"]
    filterset_fields   = ["role", "is_active", "is_verified"]
    queryset           = User.objects.all().order_by("-date_joined")


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class   = UserDetailSerializer
    queryset           = User.objects.all()


class AdminDeactivateUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        if user == request.user:
            return Response({"detail": "Cannot deactivate yourself."}, status=400)
        user.is_active = not user.is_active
        user.save()
        action = "deactivated" if not user.is_active else "activated"
        return Response({"detail": f"User {action}."})


class AdminPendingPropertiesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class   = PropertyListSerializer

    def get_queryset(self):
        return Property.objects.filter(is_approved=False, is_active=True).select_related("agent")


class AdminSiteSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class   = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.get()


class AdminRevenueView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        payments = Payment.objects.filter(status="completed")
        total    = payments.aggregate(total=Sum("amount"))["total"] or 0
        by_type  = payments.values("payment_type").annotate(total=Sum("amount"))
        return Response({"total_revenue": total, "by_type": list(by_type)})


# ─────────────────────────────────────────────────────────────
# AGENT VIEWS
# ─────────────────────────────────────────────────────────────

class AgentAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAgentOrAdmin]

    def get(self, request):
        user  = request.user
        today = timezone.now()
        listings = Property.objects.filter(agent=user)

        data = {
            "total_listings":   listings.count(),
            "active_listings":  listings.filter(is_approved=True, is_active=True).count(),
            "total_inquiries":  QuoteRequest.objects.filter(property__agent=user).count(),
            "new_inquiries":    QuoteRequest.objects.filter(
                                    property__agent=user, status="new").count(),
            "total_views":      listings.aggregate(total=Sum("view_count"))["total"] or 0,
            "upcoming_appointments": Appointment.objects.filter(
                                    agent=user, scheduled_at__gte=today,
                                    status="confirmed").order_by("scheduled_at")[:5],
            "recent_inquiries": QuoteRequest.objects.filter(
                                    property__agent=user).order_by("-created_at")[:5],
        }
        serializer = AgentAnalyticsSerializer(data)
        return Response(serializer.data)


class AgentListingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAgentOrAdmin]
    serializer_class   = PropertyListSerializer
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields   = ["status", "is_approved", "is_active", "property_type"]
    ordering_fields    = ["created_at", "view_count", "price"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        if self.request.user.role == "admin":
            return Property.objects.all()
        return Property.objects.filter(agent=self.request.user)


class AgentInquiriesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAgentOrAdmin]
    serializer_class   = QuoteRequestSerializer

    def get_queryset(self):
        if self.request.user.role == "admin":
            return QuoteRequest.objects.all().select_related("property", "hotel", "user")
        return QuoteRequest.objects.filter(
            property__agent=self.request.user
        ).select_related("property", "hotel", "user")


# ─────────────────────────────────────────────────────────────
# UTILITY / CMS VIEWS
# ─────────────────────────────────────────────────────────────

class AmenityListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = AmenitySerializer
    queryset           = Amenity.objects.all()


class PropertyTypeListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response([
            {"value": k, "label": v}
            for k, v in Property.TYPE_CHOICES
        ])


class TestimonialListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = TestimonialSerializer
    queryset           = Testimonial.objects.filter(is_active=True)


class PartnerListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = PartnerSerializer
    queryset           = Partner.objects.filter(is_active=True)


class ContactMessageView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class   = ContactMessageSerializer


class CountryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        countries = (
            Property.objects.filter(is_active=True)
            .values_list("country", flat=True)
            .distinct()
            .order_by("country")
        )
        return Response(list(countries))


class CityListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        country = request.query_params.get("country", "Kenya")
        cities  = (
            Property.objects.filter(country=country, is_active=True)
            .values_list("city", flat=True)
            .distinct()
            .order_by("city")
        )
        return Response(list(cities))


class MortgageCalculatorView(APIView):
    """Simple server-side mortgage calc (can be done client-side too)."""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            principal    = float(request.data.get("principal", 0))
            annual_rate  = float(request.data.get("annual_rate", 12)) / 100
            years        = int(request.data.get("years", 20))
            monthly_rate = annual_rate / 12
            n_payments   = years * 12

            if monthly_rate == 0:
                monthly = principal / n_payments
            else:
                monthly = principal * (monthly_rate * (1 + monthly_rate) ** n_payments) / (
                    (1 + monthly_rate) ** n_payments - 1
                )

            return Response({
                "monthly_payment": round(monthly, 2),
                "total_payment":   round(monthly * n_payments, 2),
                "total_interest":  round(monthly * n_payments - principal, 2),
            })
        except (TypeError, ValueError, ZeroDivisionError) as e:
            return Response({"detail": str(e)}, status=400)


class SitemapDataView(APIView):
    """Returns data needed to build a sitemap."""
    permission_classes = [AllowAny]

    def get(self, request):
        properties = Property.objects.filter(
            is_approved=True, is_active=True
        ).values("slug", "updated_at")
        hotels = Hotel.objects.filter(is_active=True).values("slug", "updated_at")
        return Response({
            "properties": list(properties),
            "hotels":     list(hotels),
        })