# Grahalakshmi Property - React Native Android App Setup

## Prerequisites
- Node.js v16+
- Android Studio
- JDK 11+
- Android SDK

## Installation

1. Install Dependencies
```bash
cd mobile-app
npm install
```

2. Configure Supabase
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Run Android
```bash
npm run android
```

4. Build Release APK
```bash
npm run build-android
```

## Database Schema (Create in Supabase)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('buyer', 'seller', 'agent', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  image_url TEXT,
  property_type TEXT CHECK (property_type IN ('buy', 'rent', 'commercial')),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);
```

## Features
✅ Property listing with filters
✅ User authentication
✅ Favorites management
✅ Admin panel
✅ User profile
✅ Bottom tab navigation
✅ Supabase integration

## Project Structure

```
src/
├── config/
│   └── supabase.ts
├── screens/
│   ├── HomeScreen.tsx
│   ├── PropertyDetailScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── AdminScreen.tsx
├── store/
│   ├── authStore.ts
│   └── propertyStore.ts
├── types/
│   └── index.ts
├── navigation/
│   └── RootNavigator.tsx
└── App.tsx
```
