"""
Django management command to seed the database with realistic test data for LuxuryHome platform.
Run with: python manage.py seed_data
Options: 
  --clear : Clear existing data before seeding
  --users=N : Number of users to create (default: 20)
  --properties=N : Number of properties to create (default: 30)
  --hotels=N : Number of hotels to create (default: 10)
"""

import random
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.contrib.auth import get_user_model
from faker import Faker
from faker.providers import geo, automotive, phone_number

from core.models import (
    User, Amenity, Property, PropertyImage, PropertyReview, Favorite,
    QuoteRequest, Hotel, HotelImage, RoomType, SeasonalPricing, 
    HotelBooking, HotelReview, Appointment, Notification, Payment,
    Testimonial, Partner, ContactMessage, SiteSettings
)

User = get_user_model()
fake = Faker()
fake.add_provider(geo)
fake.add_provider(automotive)
fake.add_provider(phone_number)

# Constants
KENYAN_COUNTIES = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", 
    "Eldoret", "Malindi", "Diani", "Naivasha", "Nyeri", "Meru"
]

CITIES = {
    "Nairobi": ["Karen", "Runda", "Lavington", "Westlands", "Kileleshwa", "Kilimani"],
    "Mombasa": ["Nyali", "Bamburi", "Diani", "Mtwapa", "Shanzu"],
    "Kisumu": ["Milimani", "Riat", "Konlele"],
    "Nakuru": ["Milimani", "Lanet", "Pipeline"]
}

PROPERTY_TITLES = [
    "Luxury Mansion", "Executive Villa", "Ocean View Penthouse", "Lakefront Estate",
    "Modern Farmhouse", "Contemporary Apartment", "Heritage Mansion", "Beachfront Villa",
    "Golf Course Estate", "Hilltop Retreat", "Urban Loft", "Garden Paradise",
    "Sunset Heights", "Palm Grove", "Serenity Heights"
]

HOTEL_NAMES = [
    "Grand Luxury", "Ocean Paradise", "Serenity Resort", "Golden Palm Hotel",
    "Safari Retreat", "Lakeview Grand", "Mountain Escape", "City Central",
    "Coastal Haven", "Royal Suites", "Tranquility Resort", "Savannah Lodge"
]

AMENITIES_LIST = [
    "Swimming Pool", "Gym", "Spa", "24/7 Security", "Parking", "Elevator",
    "Air Conditioning", "Heating", "Fireplace", "Balcony", "Garden", "Terrace",
    "Smart Home", "Solar Panels", "Wine Cellar", "Home Theater", "Sauna",
    "Tennis Court", "Beach Access", "Private Chef", "Concierge", "Laundry Service",
    "Pet Friendly", "Wheelchair Access", "Free WiFi", "Room Service", "Airport Shuttle"
]


class Command(BaseCommand):
    help = 'Seed the database with realistic test data for LuxuryHome platform'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing data before seeding',
        )
        parser.add_argument(
            '--users',
            type=int,
            default=20,
            help='Number of users to create (default: 20)',
        )
        parser.add_argument(
            '--properties',
            type=int,
            default=30,
            help='Number of properties to create (default: 30)',
        )
        parser.add_argument(
            '--hotels',
            type=int,
            default=10,
            help='Number of hotels to create (default: 10)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))
        
        if options['clear']:
            self.clear_data()
        
        # Create site settings
        self.create_site_settings()
        
        # Create amenities
        amenities = self.create_amenities()
        
        # Create users
        users = self.create_users(options['users'])
        
        # Create properties
        properties = self.create_properties(options['properties'], users, amenities)
        
        # Create property images
        self.create_property_images(properties)
        
        # Create property reviews
        self.create_property_reviews(properties, users)
        
        # Create favorites
        self.create_favorites(properties, users)
        
        # Create hotels
        hotels = self.create_hotels(options['hotels'], users, amenities)
        
        # Create hotel images
        self.create_hotel_images(hotels)
        
        # Create room types
        room_types = self.create_room_types(hotels, amenities)
        
        # Create seasonal pricing
        self.create_seasonal_pricing(room_types)
        
        # Create hotel bookings
        bookings = self.create_hotel_bookings(room_types, users)
        
        # Create hotel reviews
        self.create_hotel_reviews(hotels, users)
        
        # Create quote requests
        self.create_quote_requests(properties, hotels, users)
        
        # Create appointments
        self.create_appointments(properties, users)
        
        # Create notifications
        self.create_notifications(users)
        
        # Create payments
        self.create_payments(users, bookings)
        
        # Create testimonials
        self.create_testimonials()
        
        # Create partners
        self.create_partners()
        
        # Create contact messages
        self.create_contact_messages()
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded all data!'))

    def clear_data(self):
        """Clear all existing data from tables"""
        self.stdout.write('Clearing existing data...')
        
        # Order matters due to foreign keys
        models_to_clear = [
            Payment, Notification, Appointment, ContactMessage,
            SeasonalPricing, RoomType, HotelImage, HotelReview,
            HotelBooking, QuoteRequest, Favorite, PropertyReview,
            PropertyImage, Property, Hotel, Testimonial, Partner,
            Amenity, User, SiteSettings
        ]
        
        for model in models_to_clear:
            try:
                count = model.objects.all().delete()
                self.stdout.write(f'  Cleared {model.__name__}: {count[0]} records')
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  Error clearing {model.__name__}: {e}'))
        
        self.stdout.write(self.style.SUCCESS('Data cleared successfully'))

    def create_site_settings(self):
        """Create or update site settings"""
        settings, created = SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                'site_name': 'LuxuryHome Kenya',
                'tagline': 'Discover Your Dream Property in Kenya',
                'meta_title': 'LuxuryHome - Premium Real Estate in Kenya',
                'meta_description': 'Find luxury homes, apartments, and hotels across Kenya',
                'whatsapp_number': '+254700000000',
                'contact_email': 'info@luxuryhome.co.ke',
                'contact_phone': '+254700000000',
                'address': 'Westlands, Nairobi, Kenya',
                'facebook_url': 'https://facebook.com/luxuryhome',
                'instagram_url': 'https://instagram.com/luxuryhome',
                'twitter_url': 'https://twitter.com/luxuryhome',
            }
        )
        self.stdout.write(f'  {"Created" if created else "Updated"} Site Settings')
        return settings

    def create_amenities(self):
        """Create amenities"""
        amenities = []
        for amenity_name in AMENITIES_LIST:
            amenity, created = Amenity.objects.get_or_create(
                name=amenity_name,
                defaults={'icon': amenity_name.lower().replace(' ', '-')}
            )
            amenities.append(amenity)
        self.stdout.write(f'  Created {len(amenities)} Amenities')
        return amenities

    def create_users(self, count):
        """Create users (admin, agents, customers, hotel owners)"""
        users = []
        
        # Create admin user
        admin, created = User.objects.get_or_create(
            email='admin@luxuryhome.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'is_verified': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
        users.append(admin)
        self.stdout.write(f'  {"Created" if created else "Found"} Admin user: {admin.email}')
        
        # Create agents (20% of users)
        agent_count = max(2, int(count * 0.2))
        for i in range(agent_count):
            user = self._create_user(
                role='agent',
                is_verified=True,
                is_staff=False
            )
            users.append(user)
        
        # Create hotel owners (20% of users)
        hotel_owner_count = max(2, int(count * 0.2))
        for i in range(hotel_owner_count):
            user = self._create_user(
                role='hotel_owner',
                is_verified=True,
                is_staff=False
            )
            users.append(user)
        
        # Create customers (remaining users)
        customer_count = count - agent_count - hotel_owner_count
        for i in range(customer_count):
            user = self._create_user(
                role='customer',
                is_verified=random.choice([True, False]),
                is_staff=False
            )
            users.append(user)
        
        self.stdout.write(f'  Created {len(users)} total users (Admin: 1, Agents: {agent_count}, Hotel Owners: {hotel_owner_count}, Customers: {customer_count})')
        return users

    def _create_user(self, role, is_verified, is_staff):
        """Helper to create a single user"""
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
        
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=fake.phone_number()[:30],
            role=role,
            bio=fake.text(max_nb_chars=200),
            is_verified=is_verified,
            is_staff=is_staff,
            date_joined=timezone.now() - timedelta(days=random.randint(1, 365))
        )
        user.set_password('password123')
        user.save()
        return user

    def create_properties(self, count, users, amenities):
        """Create properties"""
        properties = []
        agents = [u for u in users if u.role in ['agent', 'admin']]
        
        for i in range(count):
            is_featured = random.choice([True, False])
            is_approved = random.choice([True, False, True, True])  # 75% approved
            
            # Select random location
            country = "Kenya"
            city = random.choice(KENYAN_COUNTIES)
            county_state = city
            
            property_type = random.choice(['mansion', 'villa', 'apartment', 'land', 'beach', 'commercial', 'investment'])
            
            property = Property(
                title=f"{random.choice(PROPERTY_TITLES)} - {fake.word().title()}",
                property_type=property_type,
                status=random.choice(['sale', 'rent', 'sold', 'off_market']),
                description=fake.text(max_nb_chars=500),
                price=Decimal(random.randint(5000000, 500000000)),
                currency=random.choice(['KES', 'USD']),
                price_on_request=random.choice([True, False]),
                country=country,
                county_state=county_state,
                city=city,
                exact_location=fake.street_address(),
                latitude=Decimal(str(random.uniform(-4.0, 4.0))),
                longitude=Decimal(str(random.uniform(34.0, 42.0))),
                bedrooms=random.randint(1, 10) if property_type != 'land' else None,
                bathrooms=random.randint(1, 8) if property_type != 'land' else None,
                size_sqft=Decimal(str(random.uniform(500, 10000))),
                size_acres=Decimal(str(random.uniform(0.1, 50))) if property_type == 'land' else None,
                year_built=random.randint(1980, 2024),
                floors=random.randint(1, 5),
                parking_spaces=random.randint(1, 20),
                is_furnished=random.choice([True, False]),
                agent=random.choice(agents) if agents else None,
                is_featured=is_featured,
                is_approved=is_approved,
                is_active=True,
                view_count=random.randint(0, 1000),
                created_at=timezone.now() - timedelta(days=random.randint(1, 180))
            )
            property.save()
            
            # Add random amenities (3-8 per property)
            property_amenities = random.sample(amenities, random.randint(3, 8))
            property.amenities.add(*property_amenities)
            
            properties.append(property)
            
            if (i + 1) % 10 == 0:
                self.stdout.write(f'    Created {i + 1} properties...')
        
        self.stdout.write(f'  Created {len(properties)} Properties')
        return properties

    def create_property_images(self, properties):
        """Create property images (using placeholder images)"""
        image_count = 0
        for property in properties:
            # Create 3-8 images per property
            num_images = random.randint(3, 8)
            for i in range(num_images):
                PropertyImage.objects.create(
                    property=property,
                    caption=f"Beautiful view of {property.title}",
                    order=i
                )
                image_count += 1
        
        self.stdout.write(f'  Created {image_count} Property Images')

    def create_property_reviews(self, properties, users):
        """Create property reviews"""
        customers = [u for u in users if u.role == 'customer']
        reviews = []
        
        for property in properties:
            # Not all properties have reviews
            if random.random() > 0.6:
                continue
                
            # Create 2-8 reviews per property
            num_reviews = random.randint(2, 8)
            reviewers = random.sample(customers, min(num_reviews, len(customers)))
            
            for reviewer in reviewers:
                review = PropertyReview.objects.create(
                    property=property,
                    author=reviewer,
                    rating=random.randint(3, 5),
                    comment=fake.text(max_nb_chars=300),
                    created_at=timezone.now() - timedelta(days=random.randint(1, 90))
                )
                reviews.append(review)
        
        self.stdout.write(f'  Created {len(reviews)} Property Reviews')

    def create_favorites(self, properties, users):
        """Create user favorites"""
        customers = [u for u in users if u.role == 'customer']
        favorites = []
        
        for user in customers:
            # Each user favorites 3-15 properties
            num_favorites = random.randint(3, 15)
            favorite_properties = random.sample(properties, min(num_favorites, len(properties)))
            
            for property in favorite_properties:
                try:
                    favorite = Favorite.objects.create(
                        user=user,
                        property=property,
                        created_at=timezone.now() - timedelta(days=random.randint(1, 90))
                    )
                    favorites.append(favorite)
                except:
                    pass  # Duplicate favorite
        
        self.stdout.write(f'  Created {len(favorites)} Favorites')

    def create_hotels(self, count, users, amenities):
        """Create hotels"""
        hotels = []
        hotel_owners = [u for u in users if u.role in ['hotel_owner', 'admin']]
        
        for i in range(count):
            is_featured = random.choice([True, False])
            
            # Select random location
            city = random.choice(KENYAN_COUNTIES)
            
            hotel = Hotel(
                name=f"{random.choice(HOTEL_NAMES)} {city}",
                description=fake.text(max_nb_chars=500),
                star_rating=random.randint(3, 5),
                total_rooms=random.randint(20, 200),
                country="Kenya",
                county_state=city,
                city=city,
                exact_location=fake.street_address(),
                latitude=Decimal(str(random.uniform(-4.0, 4.0))),
                longitude=Decimal(str(random.uniform(34.0, 42.0))),
                price_per_night=Decimal(random.randint(5000, 50000)),
                currency=random.choice(['KES', 'USD']),
                owner=random.choice(hotel_owners) if hotel_owners else None,
                is_featured=is_featured,
                is_active=True,
                created_at=timezone.now() - timedelta(days=random.randint(1, 180))
            )
            hotel.save()
            
            # Add random amenities (5-10 per hotel)
            hotel_amenities = random.sample(amenities, random.randint(5, 10))
            hotel.amenities.add(*hotel_amenities)
            
            hotels.append(hotel)
        
        self.stdout.write(f'  Created {len(hotels)} Hotels')
        return hotels

    def create_hotel_images(self, hotels):
        """Create hotel images"""
        image_count = 0
        for hotel in hotels:
            # Create 5-12 images per hotel
            num_images = random.randint(5, 12)
            for i in range(num_images):
                HotelImage.objects.create(
                    hotel=hotel,
                    caption=f"Amazing {hotel.name} view",
                    order=i
                )
                image_count += 1
        
        self.stdout.write(f'  Created {image_count} Hotel Images')

    def create_room_types(self, hotels, amenities):
        """Create room types for hotels"""
        room_types = []
        room_type_names = [
            "Standard Room", "Deluxe Room", "Executive Suite", "Presidential Suite",
            "Family Room", "Ocean View Room", "Garden View Room", "Pool View Suite",
            "Business Suite", "Honeymoon Suite"
        ]
        
        for hotel in hotels:
            # Create 3-7 room types per hotel
            num_room_types = random.randint(3, 7)
            selected_names = random.sample(room_type_names, num_room_types)
            
            for name in selected_names:
                room_type = RoomType.objects.create(
                    hotel=hotel,
                    name=name,
                    description=fake.text(max_nb_chars=200),
                    capacity=random.randint(2, 6),
                    beds=random.randint(1, 4),
                    size_sqm=Decimal(str(random.uniform(25, 150))),
                    price_per_night=Decimal(random.randint(3000, 30000)),
                    total_units=random.randint(5, 50),
                    is_available=True
                )
                
                # Add room amenities
                room_amenities = random.sample(amenities, random.randint(3, 6))
                room_type.amenities.add(*room_amenities)
                
                room_types.append(room_type)
        
        self.stdout.write(f'  Created {len(room_types)} Room Types')
        return room_types

    def create_seasonal_pricing(self, room_types):
        """Create seasonal pricing for room types"""
        seasons = [
            {"name": "Peak Season", "months": [12, 1, 2], "multiplier": 1.5},
            {"name": "High Season", "months": [6, 7, 8], "multiplier": 1.3},
            {"name": "Low Season", "months": [3, 4, 5], "multiplier": 0.8},
        ]
        
        seasonal_prices = []
        current_year = timezone.now().year
        
        for room_type in room_types:
            for season in seasons:
                start_date = datetime(current_year, season["months"][0], 1).date()
                end_date = datetime(current_year, season["months"][-1], 28).date()
                
                seasonal_price = SeasonalPricing.objects.create(
                    room_type=room_type,
                    name=season["name"],
                    start_date=start_date,
                    end_date=end_date,
                    price_per_night=room_type.price_per_night * Decimal(str(season["multiplier"]))
                )
                seasonal_prices.append(seasonal_price)
        
        self.stdout.write(f'  Created {len(seasonal_prices)} Seasonal Pricing records')

    def create_hotel_bookings(self, room_types, users):
        """Create hotel bookings"""
        bookings = []
        customers = [u for u in users if u.role == 'customer']
        
        for _ in range(100):  # Create 100 bookings
            room_type = random.choice(room_types)
            user = random.choice(customers) if customers and random.random() > 0.3 else None
            
            check_in = timezone.now().date() + timedelta(days=random.randint(1, 90))
            check_out = check_in + timedelta(days=random.randint(1, 14))
            nights = (check_out - check_in).days
            
            total_price = room_type.price_per_night * Decimal(str(nights))
            
            booking = HotelBooking.objects.create(
                hotel=room_type.hotel,
                room_type=room_type,
                guest_name=user.get_full_name() if user else fake.name(),
                guest_email=user.email if user else fake.email(),
                guest_phone=fake.phone_number()[:30],
                user=user,
                check_in=check_in,
                check_out=check_out,
                guests=random.randint(1, room_type.capacity),
                rooms=random.randint(1, 3),
                total_price=total_price,
                currency=random.choice(['KES', 'USD']),
                special_requests=fake.text(max_nb_chars=200) if random.random() > 0.7 else "",
                status=random.choice(['pending', 'confirmed', 'cancelled', 'completed']),
                created_at=timezone.now() - timedelta(days=random.randint(1, 180))
            )
            bookings.append(booking)
        
        self.stdout.write(f'  Created {len(bookings)} Hotel Bookings')
        return bookings

    def create_hotel_reviews(self, hotels, users):
        """Create hotel reviews"""
        customers = [u for u in users if u.role == 'customer']
        reviews = []
        
        for hotel in hotels:
            if random.random() > 0.5:
                continue
                
            num_reviews = random.randint(3, 15)
            reviewers = random.sample(customers, min(num_reviews, len(customers)))
            
            for reviewer in reviewers:
                review = HotelReview.objects.create(
                    hotel=hotel,
                    author=reviewer,
                    rating=random.randint(3, 5),
                    title=fake.sentence(nb_words=6)[:150],
                    comment=fake.text(max_nb_chars=300),
                    created_at=timezone.now() - timedelta(days=random.randint(1, 180))
                )
                reviews.append(review)
        
        self.stdout.write(f'  Created {len(reviews)} Hotel Reviews')

    def create_quote_requests(self, properties, hotels, users):
        """Create quote/inquiry requests"""
        quote_requests = []
        
        for _ in range(150):
            target_type = random.choice(['property', 'hotel', 'general'])
            
            if target_type == 'property' and properties:
                property = random.choice(properties)
                hotel = None
                target_str = property.title
            elif target_type == 'hotel' and hotels:
                property = None
                hotel = random.choice(hotels)
                target_str = hotel.name
            else:
                property = None
                hotel = None
                target_str = "General Inquiry"
            
            user = random.choice(users) if random.random() > 0.4 else None
            
            quote = QuoteRequest.objects.create(
                property=property,
                hotel=hotel,
                full_name=user.get_full_name() if user else fake.name(),
                email=user.email if user else fake.email(),
                phone=fake.phone_number()[:30],
                budget=f"KES {random.randint(1000000, 100000000):,}" if random.random() > 0.5 else "",
                inquiry_type=random.choice(['quote', 'viewing', 'financing', 'negotiate', 'general']),
                message=fake.text(max_nb_chars=500),
                viewing_date=timezone.now().date() + timedelta(days=random.randint(1, 30)) if random.random() > 0.7 else None,
                user=user,
                status=random.choice(['new', 'in_progress', 'responded', 'closed']),
                created_at=timezone.now() - timedelta(days=random.randint(1, 120))
            )
            quote_requests.append(quote)
        
        self.stdout.write(f'  Created {len(quote_requests)} Quote Requests')

    def create_appointments(self, properties, users):
        """Create property viewing appointments"""
        appointments = []
        agents = [u for u in users if u.role in ['agent', 'admin']]
        customers = [u for u in users if u.role == 'customer']
        
        for _ in range(80):
            property = random.choice(properties)
            agent = random.choice(agents) if agents else None
            user = random.choice(customers) if random.random() > 0.4 else None
            
            appointment = Appointment.objects.create(
                property=property,
                agent=agent,
                client_name=user.get_full_name() if user else fake.name(),
                client_email=user.email if user else fake.email(),
                client_phone=fake.phone_number()[:30],
                user=user,
                scheduled_at=timezone.now() + timedelta(days=random.randint(1, 30), hours=random.randint(9, 17)),
                notes=fake.text(max_nb_chars=200) if random.random() > 0.7 else "",
                status=random.choice(['pending', 'confirmed', 'cancelled', 'completed']),
                created_at=timezone.now() - timedelta(days=random.randint(1, 60))
            )
            appointments.append(appointment)
        
        self.stdout.write(f'  Created {len(appointments)} Appointments')

    def create_notifications(self, users):
        """Create notifications for users"""
        notifications = []
        notification_types = ['quote', 'booking', 'appointment', 'approval', 'review', 'system']
        
        for user in users:
            # Create 5-20 notifications per user
            num_notifications = random.randint(5, 20)
            
            for _ in range(num_notifications):
                notif_type = random.choice(notification_types)
                notification = Notification.objects.create(
                    recipient=user,
                    notif_type=notif_type,
                    title=f"New {notif_type} notification",
                    message=fake.text(max_nb_chars=150),
                    is_read=random.choice([True, False]),
                    created_at=timezone.now() - timedelta(days=random.randint(1, 60))
                )
                notifications.append(notification)
        
        self.stdout.write(f'  Created {len(notifications)} Notifications')

    def create_payments(self, users, bookings):
        """Create payment records"""
        payments = []
        customers = [u for u in users if u.role == 'customer']
        
        for _ in range(50):
            user = random.choice(customers) if customers and random.random() > 0.3 else None
            booking = random.choice(bookings) if bookings and random.random() > 0.5 else None
            
            payment = Payment.objects.create(
                user=user,
                payment_type=random.choice(['booking', 'deposit', 'service']),
                amount=Decimal(random.randint(5000, 1000000)),
                currency=random.choice(['KES', 'USD']),
                status=random.choice(['pending', 'completed', 'failed', 'refunded']),
                phone_number=fake.phone_number()[:20],
                mpesa_receipt=f"MPESA{random.randint(1000000, 9999999)}" if random.random() > 0.5 else "",
                hotel_booking=booking if random.random() > 0.7 else None,
                description=fake.text(max_nb_chars=100),
                created_at=timezone.now() - timedelta(days=random.randint(1, 120)),
                completed_at=timezone.now() - timedelta(days=random.randint(1, 30)) if random.random() > 0.4 else None
            )
            payments.append(payment)
        
        self.stdout.write(f'  Created {len(payments)} Payments')

    def create_testimonials(self):
        """Create testimonials"""
        testimonials = []
        testimonial_data = [
            ("Sarah Johnson", "Homeowner", "The team at LuxuryHome helped me find my dream villa in Karen. Excellent service!", 5),
            ("Michael Ochieng", "Investor", "Professional and efficient service. Found great investment properties.", 5),
            ("Emily Wambui", "First-time Buyer", "Made the process of buying my first home stress-free.", 4),
            ("James Mwangi", "Hotel Owner", "Great platform for listing our hotel. Received many bookings!", 5),
            ("Dr. Patricia Achieng", "Property Seller", "Sold my property within weeks. Highly recommended!", 5),
        ]
        
        for name, role, content, rating in testimonial_data:
            testimonial = Testimonial.objects.create(
                author_name=name,
                author_role=role,
                content=content,
                rating=rating,
                is_active=True,
                order=len(testimonials)
            )
            testimonials.append(testimonial)
        
        self.stdout.write(f'  Created {len(testimonials)} Testimonials')

    def create_partners(self):
        """Create partners"""
        partners = []
        partner_names = [
            "Kenya Property Developers", "Nairobi Real Estate", "Coast Hotels",
            "Sunset Resorts", "Prime Locations Ltd", "Luxury Living Kenya"
        ]
        
        for i, name in enumerate(partner_names):
            partner = Partner.objects.create(
                name=name,
                website=f"https://www.{name.lower().replace(' ', '')}.com",
                is_active=True,
                order=i
            )
            partners.append(partner)
        
        self.stdout.write(f'  Created {len(partners)} Partners')

    def create_contact_messages(self):
        """Create contact messages"""
        messages = []
        
        for _ in range(30):
            message = ContactMessage.objects.create(
                name=fake.name(),
                email=fake.email(),
                phone=fake.phone_number()[:30],
                subject=fake.sentence(nb_words=6)[:255],
                message=fake.text(max_nb_chars=500),
                is_read=random.choice([True, False]),
                created_at=timezone.now() - timedelta(days=random.randint(1, 90))
            )
            messages.append(message)
        
        self.stdout.write(f'  Created {len(messages)} Contact Messages')