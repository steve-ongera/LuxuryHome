# 🏛️ LuxuryHome – Premium Real Estate Platform

A world-class luxury real estate marketplace for buying, selling, renting, and requesting quotations for premium properties. Inspired by Sotheby's Realty, Airbnb Luxury, and Zillow Luxury.

---

## 🌟 Features

- **Property Types**: Lands, Mansions, Villas, Luxury Apartments, Hotels & Resorts, Commercial, Beach, Investment
- **Quote Requests**: No account required — anyone can request a quotation
- **Hotel Booking Module**: Room listings, availability, seasonal pricing
- **Advanced Search & Filters**: Property type, price, location, beds, baths
- **SEO Optimized**: Slugs, meta tags, Open Graph, structured data, sitemap
- **Admin Dashboard**: Full management of users, properties, analytics
- **Agent Dashboard**: Listings, inquiries, appointments
- **Favorites / Wishlist / Compare**
- **Mortgage Calculator**
- **AI Property Recommendations**
- **M-Pesa & WhatsApp Integration**
- **JWT Authentication + Role-Based Access**

---

## 🗂️ Project Structure

```
luxuryhome/
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── luxuryhome/           # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── core/                 # Single Django app
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── property.py
│       │   ├── quote.py
│       │   └── hotel.py
│       ├── serializers/
│       ├── views/
│       ├── urls/
│       ├── admin.py
│       ├── permissions.py
│       └── migrations/
│
└── frontend/                 # React + Vite
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── styles/
        │   └── main.css
        ├── utils/
        │   └── api.js
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   ├── useProperties.js
        │   └── useAuth.js
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   └── Layout.jsx
        │   ├── ui/
        │   │   ├── Button.jsx
        │   │   ├── Badge.jsx
        │   │   ├── Card.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Loader.jsx
        │   │   └── SearchBar.jsx
        │   ├── property/
        │   │   ├── PropertyCard.jsx
        │   │   ├── PropertyGrid.jsx
        │   │   ├── PropertyFilters.jsx
        │   │   ├── PropertyGallery.jsx
        │   │   ├── PropertyMap.jsx
        │   │   └── MortgageCalculator.jsx
        │   ├── quote/
        │   │   └── QuoteForm.jsx
        │   ├── hotel/
        │   │   └── HotelCard.jsx
        │   └── auth/
        │       ├── LoginForm.jsx
        │       └── RegisterForm.jsx
        └── pages/
            ├── Home.jsx
            ├── Properties.jsx
            ├── PropertyDetail.jsx
            ├── Hotels.jsx
            ├── HotelDetail.jsx
            ├── About.jsx
            ├── Contact.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard/
            │   ├── AdminDashboard.jsx
            │   ├── AgentDashboard.jsx
            │   └── UserDashboard.jsx
            └── NotFound.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Cloudinary account (or AWS S3)

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Backend `.env.example`

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=luxuryhome
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=yourpassword

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# M-Pesa (Safaricom Daraja)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

FRONTEND_URL=http://localhost:5173
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env

# Start development server
npm run dev

# Build for production
npm run build
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_WHATSAPP_NUMBER=+254700000000
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login & get JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/google/` | Google OAuth login |
| POST | `/api/auth/forgot-password/` | Send password reset email |
| POST | `/api/auth/reset-password/` | Reset password |
| GET | `/api/auth/me/` | Get current user profile |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties/` | List all properties |
| GET | `/api/properties/?type=villa&city=nairobi` | Filter properties |
| GET | `/api/properties/{slug}/` | Property detail by SEO slug |
| POST | `/api/properties/` | Create property (Agent/Admin) |
| PUT | `/api/properties/{slug}/` | Update property |
| DELETE | `/api/properties/{slug}/` | Delete property |
| GET | `/api/properties/featured/` | Featured properties |
| GET | `/api/properties/trending/` | Trending properties |
| POST | `/api/properties/{slug}/favorite/` | Toggle favorite |
| GET | `/api/properties/favorites/` | User favorites |

### Quote Requests (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quotes/` | Submit quote request |
| GET | `/api/quotes/` | List quotes (Admin/Agent) |
| PUT | `/api/quotes/{id}/` | Update quote status |

### Hotels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels/` | List all hotels |
| GET | `/api/hotels/{slug}/` | Hotel detail |
| POST | `/api/hotels/{slug}/book/` | Book hotel room |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics/` | Platform analytics |
| GET | `/api/admin/users/` | Manage users |
| PUT | `/api/admin/properties/{id}/approve/` | Approve property |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Gold | `#C9A84C` |
| Deep Black | `#0A0A0A` |
| Warm White | `#F5F0E8` |
| Dark Gray | `#1A1A1A` |
| Light Gray | `#E8E3D8` |
| Font Display | `Cormorant Garamond` |
| Font Body | `Jost` |

---

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Full platform control, approve listings, manage all users |
| **Agent** | Create/edit listings, manage inquiries, view analytics |
| **Hotel Owner** | Manage hotel rooms, bookings, pricing |
| **Customer** | Save favorites, track quotes, book viewings |
| **Guest** | Browse listings, request quotes (no account needed) |

---

## 📦 Backend Dependencies (`requirements.txt`)

```
django==5.0.4
djangorestframework==3.15.1
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
django-environ==0.11.2
psycopg2-binary==2.9.9
cloudinary==1.39.1
django-cloudinary-storage==0.3.0
Pillow==10.3.0
django-filter==24.2
drf-spectacular==0.27.2
social-auth-app-django==5.4.1
celery==5.3.6
redis==5.0.3
django-redis==5.4.0
gunicorn==21.2.0
whitenoise==6.6.0
python-slugify==8.0.4
```

---

## 📦 Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "axios": "^1.7.2",
    "framer-motion": "^11.2.0",
    "@react-google-maps/api": "^2.19.3",
    "react-image-gallery": "^1.3.0",
    "react-datepicker": "^6.9.0",
    "react-select": "^5.8.0",
    "react-toastify": "^10.0.5",
    "react-helmet-async": "^2.0.4",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1",
    "lucide-react": "^0.383.0",
    "@googlemaps/js-api-loader": "^1.16.6",
    "swiper": "^11.1.4",
    "numeral": "^2.0.6",
    "dayjs": "^1.11.11"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## 🌍 Deployment

### Backend (Railway / Render / DigitalOcean)
```bash
# Collect static files
python manage.py collectstatic

# Run with gunicorn
gunicorn luxuryhome.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (Vercel / Netlify)
```bash
npm run build
# Deploy dist/ folder
```

---

## 📱 Mobile Support
Fully responsive with mobile-first Tailwind CSS. Tested on:
- iOS Safari
- Android Chrome
- Tablet landscape/portrait

---

## 📄 License
MIT License — see `LICENSE` for details.

---

## 🤝 Contributing
1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Built with ❤️ for the luxury real estate market.