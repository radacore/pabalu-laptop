# Pabalu Laptop

A laptop inventory and service management system built with Laravel + React (Inertia.js). Tracks laptop stock, service/repair orders, customers, and financial transactions with role-based access and multi-language support (English/Indonesian).

## Features

- **Laptop Inventory** -- Full CRUD with brand/source classification, hardware specs (processor, RAM, storage, GPU, display, etc.), condition tracking (new/used/refurbished/for parts), status (available/sold), and multi-photo upload with automatic WebP compression
- **Service Management** -- Service request tracking with status lifecycle, technician updates, parts management, and photo attachments
- **Customer Management** -- Customer directory with service history
- **Financial Transactions** -- Income and expense records
- **Dashboard** -- Monthly income/expense chart (3/6/12 month range), recent service and transaction summaries
- **Role-Based Access Control** -- Super Admin, Admin, and Customer roles with granular permission management
- **Public Service Tracking** -- Anyone can look up service status by tracking code
- **Multi-Language** -- Full English and Indonesian translations via i18next + `mcamara/laravel-localization`
- **Responsive UI** -- Tailwind CSS 4 + Base UI components, mobile-friendly with dedicated desktop/mobile views

## Tech Stack

| Layer | Stack |
|---|---|
| Backend | Laravel 12, PHP 8.2 |
| Frontend | React 19, Inertia.js 2, TypeScript 5 |
| UI | Tailwind CSS 4, Base UI React, lucide-react icons |
| State | zustand, Inertia useForm |
| Database | MySQL |
| Charts | recharts (AreaChart) |
| Image | PHP GD (built-in WebP compression) |
| I18n | react-i18next, i18next, mcamara/laravel-localization |
| Testing | Pest PHP |
| Tooling | Vite, TypeScript, Pint (Laravel code style) |

## Requirements

- PHP 8.2+
- Composer
- Node.js 20+
- MySQL 8.0+
- PHP GD extension (for image uploads)

## Quick Start

```bash
git clone <repo-url>
cd pabalu-laptop

# Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Frontend
npm install
npm run build
```

### Development

```bash
# Start both PHP server and Vite dev server concurrently
composer run dev

# Or separately:
php artisan serve    # http://localhost:8000
npm run dev         # Vite hot reload
```

> Routes use localization prefixes. Access via `http://localhost:8000/en/...` or `http://localhost:8000/id/...`. After modifying routes, run `php artisan route:trans:cache`.

### Default Account

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@yuisalabs.dev | superadmin |

## Image Uploads

Laptop and service photos are automatically compressed to WebP (quality 80) via PHP's built-in GD library. No external image packages required. Files are stored at `storage/app/public/laptop-photos/` and served through the `/storage` symlink. Max file size is 5 MB per image.

## Project Structure

```
app/
  Http/
    Controllers/        -- Inertia-based controllers
    Requests/           -- Form request validation
  Models/               -- Eloquent models
  Services/             -- Business logic (LaptopService, etc.)
  Helpers/              -- Utility helpers (ImageHelper)
database/
  migrations/           -- Database schema
  seeders/              -- Seed data (roles, permissions, brands)
resources/js/
  Components/           -- Shared reusable components (form fields, UI kit)
  Features/             -- Feature modules (laptop, service, customer, ...)
  Layouts/              -- Page layouts (authenticated, guest)
  Pages/                -- Inertia page components
  Stores/               -- Zustand state stores
  Utils/                -- Utility helpers (cn, etc.)
lang/                   -- Translation files (en.json, id.json)
routes/                 -- Web routes (localized with locale prefix)
```

## Public Tracking

Customers can track their service status without logging in at `/en/track` or `/id/track` using the tracking code provided at service creation.

Make sure to update your `APP_URL` in the `.env` file before using the route function. Then, run `npm run dev` to generate and watch routes properly during development.

> [!WARNING]
> This project uses `mcamara/laravel-localization`. You MUST ensure `APP_URL` matches your local development URL exactly (e.g. `http://selia-laravel.test` or `http://localhost:8000`).
>
> Additionally, whenever you modify routes, you MUST run:
> ```bash
> php artisan route:trans:cache
> ```

> [!CAUTION]
> This project enforces **Conventional Commits** using `commitlint` and `husky`.
> Ensure your commit messages follow the standard format (e.g., `feat: add new login page`).

For detailed setup and development instructions, please read [HOW_TO_DEVELOP.md](HOW_TO_DEVELOP.md).

## Laravel Inertia React with TypeScript

By default, packages like Laravel Breeze use regular JavaScript for React. However, this project is tailored for those who want an Inertia.js boilerplate with TypeScript, enhanced with the **Selia UI Kit**.

### Default Account
```bash
Email: superadmin@yuisalabs.dev
Password: superadmin
```

### Features

- **Authentication**: Full auth scaffolding (Login, Register, Password Reset, Email Verification).
- **Access Control List (ACL)**: Full ACL scaffolding (Role, Permission, User Role, User Permission).
- **User Profile**: Profile management with update and delete capabilities.
- **TypeScript**: Fully typed codebase for better developer experience.
- **Selia UI**: Custom UI components and design system.
- **Modern Architecture**: Feature-based folder structure for scalability.

### Folder Structure

This project adopts a **feature-based architecture** to keep the codebase scalable and maintainable. Instead of grouping files by type (controllers, views, etc.), we group them by **feature** where possible, especially in the frontend.

#### Frontend (`resources/js/`)

```
resources/js/
├── components/         # Shared UI components (Button, Input, etc.)
├── layouts/            # Layout wrappers (AuthenticatedLayout, GuestLayout, PublicLayout)
├── pages/              # Inertia Page components (entry points)
│   ├── auth/           # Auth pages (Login, Register, etc.) - specific layout/view logic
│   └── ...
├── features/           # Feature-specific logic and specialized components
│   ├── auth/           # Authentication feature
│   │   └── components/ # Forms and logical components (LoginForm, RegisterForm, etc.)
│   └── ...
└── ...
```

**Key Concept:**
- **Pages (`resources/js/pages`)**: Should focused on **Layout** and **Routing**. They act as the "Controller" of the frontend, receiving data from Inertia props and organizing the page structure.
- **Features (`resources/js/features`)**: Contain the **Business Logic** and **Complex Components**. For example, the `LoginForm` component handles the form state, validation, and submission, while the `LoginPage` simply places that form into the `GuestLayout`.

This separation allows for easier testing, reuse of feature logic, and a cleaner separation of concerns.
