"""
Django admin configuration for LuxuryHome platform.
Provides custom admin interfaces for all models with search, filters, and inline editing.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import (
    User, EmailVerificationToken, PasswordResetToken,
    Amenity, Property, PropertyImage, PropertyReview, Favorite,
    QuoteRequest, Hotel, HotelImage, RoomType, SeasonalPricing,
    HotelBooking, HotelReview, Appointment, Notification,
    Payment, Testimonial, Partner, ContactMessage, SiteSettings
)


# ─────────────────────────────────────────────────────────────
# USER ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'email', 'full_name', 'role', 'is_verified', 'is_active',
        'is_staff', 'date_joined', 'avatar_preview'
    )
    list_filter = (
        'role', 'is_verified', 'is_active', 'is_staff', 'is_superuser',
        'date_joined'
    )
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)
    readonly_fields = ('id', 'date_joined', 'updated_at', 'avatar_preview')
    
    fieldsets = (
        ('Account Information', {
            'fields': ('id', 'email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone', 'avatar', 'avatar_preview', 'bio')
        }),
        ('Role & Permissions', {
            'fields': ('role', 'is_active', 'is_verified', 'is_staff', 'is_superuser',
                      'groups', 'user_permissions')
        }),
        ('OAuth', {
            'fields': ('google_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('date_joined', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )
    
    def full_name(self, obj):
        return obj.get_full_name()
    full_name.short_description = 'Full Name'
    full_name.admin_order_field = 'first_name'
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.avatar.url)
        return "No Avatar"
    avatar_preview.short_description = 'Avatar Preview'
    
    actions = ['mark_as_verified', 'mark_as_unverified', 'make_active', 'make_inactive']
    
    def mark_as_verified(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} users marked as verified.')
    mark_as_verified.short_description = 'Mark selected users as verified'
    
    def mark_as_unverified(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} users marked as unverified.')
    mark_as_unverified.short_description = 'Mark selected users as unverified'
    
    def make_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users activated.')
    make_active.short_description = 'Activate selected users'
    
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users deactivated.')
    make_inactive.short_description = 'Deactivate selected users'


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'is_expired')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'token')
    readonly_fields = ('token', 'created_at')
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = 'Expired?'


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'used', 'is_expired')
    list_filter = ('used', 'created_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('token', 'created_at')
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = 'Expired?'


# ─────────────────────────────────────────────────────────────
# AMENITY ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'property_count', 'hotel_count')
    search_fields = ('name',)
    ordering = ('name',)
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            property_count=Count('properties'),
            hotel_count=Count('hotels')
        )
    
    def property_count(self, obj):
        return obj.property_count
    property_count.short_description = 'Properties'
    
    def hotel_count(self, obj):
        return obj.hotel_count
    hotel_count.short_description = 'Hotels'


# ─────────────────────────────────────────────────────────────
# PROPERTY INLINES
# ─────────────────────────────────────────────────────────────

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ('image', 'caption', 'order', 'image_preview')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="75" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'


class PropertyReviewInline(admin.TabularInline):
    model = PropertyReview
    extra = 0
    fields = ('author', 'rating', 'comment', 'created_at')
    readonly_fields = ('created_at',)
    can_delete = True
    show_change_link = True


class PropertyAmenityInline(admin.TabularInline):
    model = Property.amenities.through
    extra = 1
    verbose_name = 'Amenity'
    verbose_name_plural = 'Amenities'


# ─────────────────────────────────────────────────────────────
# PROPERTY ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'property_type', 'status', 'price_display', 'city',
        'agent_link', 'is_featured', 'is_approved', 'is_active', 'view_count'
    )
    list_filter = (
        'property_type', 'status', 'is_featured', 'is_approved', 'is_active',
        'currency', 'city', 'created_at'
    )
    search_fields = ('title', 'slug', 'description', 'city', 'exact_location')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('id', 'slug', 'view_count', 'created_at', 'updated_at', 'featured_image_preview')
    list_editable = ('is_featured', 'is_approved', 'is_active')
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'slug', 'property_type', 'status', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'currency', 'price_on_request')
        }),
        ('Location', {
            'fields': ('country', 'county_state', 'city', 'exact_location', 'latitude', 'longitude')
        }),
        ('Specifications', {
            'fields': ('bedrooms', 'bathrooms', 'size_sqft', 'size_acres', 'year_built', 
                      'floors', 'parking_spaces', 'is_furnished')
        }),
        ('Media & SEO', {
            'fields': ('featured_image', 'featured_image_preview', 'video_tour_url',
                      'seo_title', 'seo_description', 'seo_image')
        }),
        ('Relations', {
            'fields': ('agent',)
        }),
        ('Flags', {
            'fields': ('is_featured', 'is_approved', 'is_active')
        }),
        ('Statistics', {
            'fields': ('view_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [PropertyImageInline, PropertyReviewInline]
    
    def featured_image_preview(self, obj):
        if obj.featured_image:
            return format_html('<img src="{}" width="200" height="150" style="object-fit: cover;" />', obj.featured_image.url)
        return "No Image"
    featured_image_preview.short_description = 'Featured Image Preview'
    
    def price_display(self, obj):
        if obj.price_on_request:
            return 'Price on Request'
        if obj.price:
            return f'{obj.currency} {obj.price:,.0f}'
        return 'N/A'
    price_display.short_description = 'Price'
    
    def agent_link(self, obj):
        if obj.agent:
            url = reverse('admin:core_user_change', args=[obj.agent.id])
            return format_html('<a href="{}">{}</a>', url, obj.agent.get_full_name())
        return '-'
    agent_link.short_description = 'Agent'
    
    actions = ['approve_properties', 'feature_properties', 'unfeature_properties']
    
    def approve_properties(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} properties approved.')
    approve_properties.short_description = 'Approve selected properties'
    
    def feature_properties(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} properties marked as featured.')
    feature_properties.short_description = 'Mark as featured'
    
    def unfeature_properties(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} properties unmarked as featured.')
    unfeature_properties.short_description = 'Remove featured status'


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image_preview', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('property__title', 'caption')
    list_editable = ('order',)
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="75" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'


@admin.register(PropertyReview)
class PropertyReviewAdmin(admin.ModelAdmin):
    list_display = ('property', 'author', 'rating', 'comment_preview', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('property__title', 'author__email', 'author__first_name', 'comment')
    readonly_fields = ('created_at',)
    
    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'property__title')
    readonly_fields = ('created_at',)


# ─────────────────────────────────────────────────────────────
# QUOTE REQUEST ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'email', 'target', 'inquiry_type', 'status',
        'created_at', 'has_response'
    )
    list_filter = ('status', 'inquiry_type', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'message')
    readonly_fields = ('id', 'created_at', 'updated_at')
    list_editable = ('status',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Inquiry Information', {
            'fields': ('id', 'property', 'hotel', 'inquiry_type', 'message')
        }),
        ('Contact Information', {
            'fields': ('full_name', 'email', 'phone', 'budget', 'viewing_date', 'user')
        }),
        ('Response', {
            'fields': ('status', 'agent_response', 'responded_at', 'responded_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def target(self, obj):
        if obj.property:
            return format_html('<a href="{}">{}</a>', 
                             reverse('admin:core_property_change', args=[obj.property.id]),
                             obj.property.title)
        elif obj.hotel:
            return format_html('<a href="{}">{}</a>',
                             reverse('admin:core_hotel_change', args=[obj.hotel.id]),
                             obj.hotel.name)
        return 'General Inquiry'
    target.short_description = 'Target'
    
    def has_response(self, obj):
        return bool(obj.agent_response)
    has_response.boolean = True
    has_response.short_description = 'Has Response'
    
    actions = ['mark_as_in_progress', 'mark_as_responded', 'mark_as_closed']
    
    def mark_as_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} inquiries marked as in progress.')
    mark_as_in_progress.short_description = 'Mark as In Progress'
    
    def mark_as_responded(self, request, queryset):
        updated = queryset.update(status='responded')
        self.message_user(request, f'{updated} inquiries marked as responded.')
    mark_as_responded.short_description = 'Mark as Responded'
    
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} inquiries closed.')
    mark_as_closed.short_description = 'Mark as Closed'


# ─────────────────────────────────────────────────────────────
# HOTEL ADMIN
# ─────────────────────────────────────────────────────────────

class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1
    fields = ('image', 'caption', 'order', 'image_preview')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="75" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'


class RoomTypeInline(admin.TabularInline):
    model = RoomType
    extra = 1
    fields = ('name', 'capacity', 'price_per_night', 'total_units', 'is_available')
    show_change_link = True


class HotelAmenityInline(admin.TabularInline):
    model = Hotel.amenities.through
    extra = 1
    verbose_name = 'Amenity'
    verbose_name_plural = 'Amenities'


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'city', 'star_rating_display', 'price_per_night', 'total_rooms',
        'owner_link', 'is_featured', 'is_active', 'created_at'
    )
    list_filter = ('star_rating', 'is_featured', 'is_active', 'city', 'country')
    search_fields = ('name', 'slug', 'description', 'city')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('id', 'created_at', 'updated_at', 'featured_image_preview')
    list_editable = ('is_featured', 'is_active')
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'slug', 'description', 'star_rating')
        }),
        ('Location', {
            'fields': ('country', 'county_state', 'city', 'exact_location', 'latitude', 'longitude')
        }),
        ('Pricing & Capacity', {
            'fields': ('price_per_night', 'currency', 'total_rooms')
        }),
        ('Media & SEO', {
            'fields': ('featured_image', 'featured_image_preview', 'seo_title', 
                      'seo_description', 'seo_image')
        }),
        ('Relations', {
            'fields': ('owner',)
        }),
        ('Flags', {
            'fields': ('is_featured', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [HotelImageInline, RoomTypeInline, HotelAmenityInline]
    
    def featured_image_preview(self, obj):
        if obj.featured_image:
            return format_html('<img src="{}" width="200" height="150" style="object-fit: cover;" />', obj.featured_image.url)
        return "No Image"
    featured_image_preview.short_description = 'Featured Image Preview'
    
    def star_rating_display(self, obj):
        stars = '★' * obj.star_rating + '☆' * (5 - obj.star_rating)
        return format_html('<span style="color: #FFD700;">{}</span>', stars)
    star_rating_display.short_description = 'Rating'
    
    def owner_link(self, obj):
        if obj.owner:
            url = reverse('admin:core_user_change', args=[obj.owner.id])
            return format_html('<a href="{}">{}</a>', url, obj.owner.get_full_name())
        return '-'
    owner_link.short_description = 'Owner'
    
    actions = ['feature_hotels', 'unfeature_hotels']
    
    def feature_hotels(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} hotels marked as featured.')
    feature_hotels.short_description = 'Mark as featured'
    
    def unfeature_hotels(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} hotels unmarked as featured.')
    unfeature_hotels.short_description = 'Remove featured status'


@admin.register(HotelImage)
class HotelImageAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'image_preview', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('hotel__name', 'caption')
    list_editable = ('order',)
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="75" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'


@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'hotel_link', 'capacity', 'beds', 'price_per_night', 'total_units', 'is_available')
    list_filter = ('is_available', 'hotel__city', 'hotel__star_rating')
    search_fields = ('name', 'description', 'hotel__name')
    list_editable = ('price_per_night', 'total_units', 'is_available')
    readonly_fields = ('id',)
    
    fieldsets = (
        ('Room Information', {
            'fields': ('hotel', 'name', 'description')
        }),
        ('Specifications', {
            'fields': ('capacity', 'beds', 'size_sqm', 'is_available')
        }),
        ('Pricing', {
            'fields': ('price_per_night', 'total_units')
        }),
        ('Media & Amenities', {
            'fields': ('image', 'amenities')
        }),
    )
    
    def hotel_link(self, obj):
        url = reverse('admin:core_hotel_change', args=[obj.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.hotel.name)
    hotel_link.short_description = 'Hotel'


@admin.register(SeasonalPricing)
class SeasonalPricingAdmin(admin.ModelAdmin):
    list_display = ('room_type', 'name', 'start_date', 'end_date', 'price_per_night')
    list_filter = ('start_date', 'end_date')
    search_fields = ('room_type__name', 'room_type__hotel__name', 'name')
    date_hierarchy = 'start_date'


@admin.register(HotelBooking)
class HotelBookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'guest_name', 'hotel_link', 'room_type_link', 'check_in', 'check_out',
        'nights', 'total_price', 'status', 'created_at'
    )
    list_filter = ('status', 'currency', 'check_in', 'check_out', 'created_at')
    search_fields = ('guest_name', 'guest_email', 'guest_phone')
    readonly_fields = ('id', 'created_at', 'updated_at', 'nights')
    list_editable = ('status',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Guest Information', {
            'fields': ('guest_name', 'guest_email', 'guest_phone', 'user')
        }),
        ('Booking Details', {
            'fields': ('hotel', 'room_type', 'check_in', 'check_out', 'nights', 'guests', 'rooms')
        }),
        ('Payment', {
            'fields': ('total_price', 'currency', 'special_requests')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def hotel_link(self, obj):
        url = reverse('admin:core_hotel_change', args=[obj.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.hotel.name)
    hotel_link.short_description = 'Hotel'
    
    def room_type_link(self, obj):
        url = reverse('admin:core_roomtype_change', args=[obj.room_type.id])
        return format_html('<a href="{}">{}</a>', url, obj.room_type.name)
    room_type_link.short_description = 'Room Type'
    
    actions = ['confirm_bookings', 'cancel_bookings', 'complete_bookings']
    
    def confirm_bookings(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} bookings confirmed.')
    confirm_bookings.short_description = 'Confirm selected bookings'
    
    def cancel_bookings(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} bookings cancelled.')
    cancel_bookings.short_description = 'Cancel selected bookings'
    
    def complete_bookings(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} bookings marked as completed.')
    complete_bookings.short_description = 'Mark as completed'


@admin.register(HotelReview)
class HotelReviewAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'author', 'rating', 'title', 'comment_preview', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('hotel__name', 'author__email', 'comment', 'title')
    readonly_fields = ('created_at',)
    
    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'


# ─────────────────────────────────────────────────────────────
# APPOINTMENT ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'client_name', 'property_link', 'agent_link', 'scheduled_at',
        'status', 'created_at'
    )
    list_filter = ('status', 'scheduled_at', 'created_at')
    search_fields = ('client_name', 'client_email', 'client_phone', 'notes')
    readonly_fields = ('id', 'created_at')
    list_editable = ('status',)
    date_hierarchy = 'scheduled_at'
    
    fieldsets = (
        ('Client Information', {
            'fields': ('client_name', 'client_email', 'client_phone', 'user')
        }),
        ('Appointment Details', {
            'fields': ('property', 'agent', 'scheduled_at', 'notes')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def property_link(self, obj):
        url = reverse('admin:core_property_change', args=[obj.property.id])
        return format_html('<a href="{}">{}</a>', url, obj.property.title)
    property_link.short_description = 'Property'
    
    def agent_link(self, obj):
        url = reverse('admin:core_user_change', args=[obj.agent.id])
        return format_html('<a href="{}">{}</a>', url, obj.agent.get_full_name())
    agent_link.short_description = 'Agent'
    
    actions = ['confirm_appointments', 'cancel_appointments', 'complete_appointments']
    
    def confirm_appointments(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} appointments confirmed.')
    confirm_appointments.short_description = 'Confirm selected appointments'
    
    def cancel_appointments(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} appointments cancelled.')
    cancel_appointments.short_description = 'Cancel selected appointments'
    
    def complete_appointments(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} appointments marked as completed.')
    complete_appointments.short_description = 'Mark as completed'


# ─────────────────────────────────────────────────────────────
# NOTIFICATION ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notif_type', 'title', 'is_read', 'created_at')
    list_filter = ('notif_type', 'is_read', 'created_at')
    search_fields = ('recipient__email', 'title', 'message')
    readonly_fields = ('id', 'created_at')
    list_editable = ('is_read',)
    date_hierarchy = 'created_at'
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = 'Mark as read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications marked as unread.')
    mark_as_unread.short_description = 'Mark as unread'


# ─────────────────────────────────────────────────────────────
# PAYMENT ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_link', 'payment_type', 'amount_display', 'status',
        'mpesa_receipt', 'created_at', 'completed_at'
    )
    list_filter = ('payment_type', 'status', 'currency', 'created_at')
    search_fields = ('user__email', 'mpesa_receipt', 'checkout_request_id', 'phone_number')
    readonly_fields = ('id', 'created_at', 'checkout_request_id', 'merchant_request_id')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('user', 'payment_type', 'amount', 'currency', 'status')
        }),
        ('M-Pesa Details', {
            'fields': ('phone_number', 'mpesa_receipt', 'checkout_request_id', 'merchant_request_id')
        }),
        ('Reference', {
            'fields': ('hotel_booking', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:core_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.email)
        return 'Anonymous'
    user_link.short_description = 'User'
    
    def amount_display(self, obj):
        return f'{obj.currency} {obj.amount:,.2f}'
    amount_display.short_description = 'Amount'
    
    actions = ['mark_as_completed', 'mark_as_failed', 'mark_as_refunded']
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} payments marked as completed.')
    mark_as_completed.short_description = 'Mark as completed'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, f'{updated} payments marked as failed.')
    mark_as_failed.short_description = 'Mark as failed'
    
    def mark_as_refunded(self, request, queryset):
        updated = queryset.update(status='refunded')
        self.message_user(request, f'{updated} payments marked as refunded.')
    mark_as_refunded.short_description = 'Mark as refunded'


# ─────────────────────────────────────────────────────────────
# UTILITY / CMS ADMIN
# ─────────────────────────────────────────────────────────────

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'author_role', 'rating', 'content_preview', 'is_active', 'order')
    list_filter = ('rating', 'is_active', 'created_at')
    search_fields = ('author_name', 'author_role', 'content')
    list_editable = ('is_active', 'order')
    
    def content_preview(self, obj):
        return obj.content[:60] + '...' if len(obj.content) > 60 else obj.content
    content_preview.short_description = 'Content'


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo_preview', 'website', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name', 'website')
    list_editable = ('is_active', 'order')
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: contain;" />', obj.logo.url)
        return "No Logo"
    logo_preview.short_description = 'Logo Preview'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_read',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} messages marked as read.')
    mark_as_read.short_description = 'Mark as read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} messages marked as unread.')
    mark_as_unread.short_description = 'Mark as unread'


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'contact_email', 'contact_phone', 'updated_at')
    
    def has_add_permission(self, request):
        # Singleton model - prevent adding multiple instances
        return not SiteSettings.objects.exists()
    
    fieldsets = (
        ('Site Information', {
            'fields': ('site_name', 'tagline')
        }),
        ('SEO Settings', {
            'fields': ('meta_title', 'meta_description', 'og_image')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'whatsapp_number', 'address')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url')
        }),
        ('Analytics', {
            'fields': ('google_analytics_id',),
            'classes': ('collapse',)
        }),
    )
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = 'Edit Site Settings'
        return super().change_view(request, object_id, form_url, extra_context=extra_context)