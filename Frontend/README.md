# Frontend - React 19 + TypeScript + Redux Toolkit

Modern React application với **Clean Architecture** và **4-layer security**.

## 🚀 Tech Stack

- **Framework**: React 19.2.0 với new JSX transform
- **Language**: TypeScript 5.7.2
- **State Management**: Redux Toolkit 2.x + React Redux
- **Routing**: React Router Dom 7.1.1 (lazy loading)
- **HTTP Client**: Axios 1.13.2 với interceptors
- **Build Tool**: Vite 7.2.6
- **Styling**: Tailwind CSS 4.1.17
- **Security**: Crypto-js 4.2.0 (AES encryption)

## 📁 Project Structure (Clean Architecture)

```
Frontend/
├── src/
│   ├── main.tsx              # Entry point với Redux Provider
│   ├── App.tsx               # Root component với routing
│   ├── index.css             # Global styles + Tailwind
│   ├── components/           # Reusable UI components
│   │   ├── Loading/         # Loading component với size variants
│   │   ├── ProtectedRoute/  # Auth-protected routes
│   │   └── PublicRoute/     # Public-only routes (redirect if authenticated)
│   ├── pages/               # Page components
│   │   ├── Home/            # Landing page
│   │   │   └── _components/layout/ # HomeHeader, HomeFooter
│   │   ├── Admin/           # Admin dashboard
│   │   │   └── _components/layout/ # AdminHeader, AdminFooter
│   │   ├── Auth/            # Login/Register page
│   │   └── NotFound/        # 404 page
│   ├── routes/              # Route configuration
│   │   └── index.tsx        # Centralized routing với lazy loading
│   ├── store/               # Redux Toolkit setup
│   │   ├── index.ts         # Store configuration
│   │   ├── hooks.ts         # Typed useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── authSlice.ts # Auth state (user, token, isAuthenticated)
│   │       └── uiSlice.ts   # UI state (theme, sidebar, notifications, modal)
│   ├── services/            # API services
│   │   ├── api.ts           # Axios instance với interceptors
│   │   ├── authService.ts   # Auth API calls
│   │   └── index.ts         # Service exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Auth operations
│   │   ├── useApi.ts        # API state management
│   │   ├── useDebounce.ts   # Debounce utility
│   │   └── useLocalStorage.ts # Local storage wrapper
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Auth context provider
│   │   └── index.ts         # Context exports
│   ├── utils/               # Utility functions
│   │   ├── security.ts      # Encryption, CSRF, rate limiting
│   │   ├── validation.ts    # Form validation
│   │   ├── format.ts        # Date, number formatting
│   │   └── helpers.ts       # General utilities
│   ├── config/              # Configuration files
│   │   ├── env.ts           # Environment variables
│   │   └── security.ts      # Security constants
│   ├── constants/           # App constants
│   │   └── index.ts         # API endpoints, roles, etc.
│   ├── types/               # TypeScript types
│   │   └── index.ts         # All interfaces & types
│   ├── features/            # Feature modules (future)
│   └── assets/              # Static assets
├── public/                  # Public static files
├── dist/                    # Production build (auto-generated)
├── .env                     # Environment variables
├── .env.example            # Environment template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── tailwind.config.js      # Tailwind CSS config
```

## 🛡️ 4-Layer Security Architecture

### Layer 1: Data Encryption (AES-256)
- Sensitive data encryption before storage
- Secure key management
- AES-256-CBC algorithm

### Layer 2: CSRF Protection
- Token generation for each request
- Token validation on backend
- Automatic token refresh

### Layer 3: Rate Limiting (Client-side)
- Track request frequency
- Prevent abuse
- Configurable limits per endpoint

### Layer 4: Secure Storage
- sessionStorage for tokens (auto-clear on tab close)
- Encrypted localStorage for sensitive data
- No sensitive data in cookies

## ⚙️ Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=React Final
VITE_APP_VERSION=1.0.0

# Security
VITE_ENCRYPTION_KEY=your-32-character-encryption-key
VITE_ENABLE_ENCRYPTION=true
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Development Mode

```bash
npm run dev
# App runs on http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📜 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Type check without building |
| `npm run lint` | Run ESLint |

## 🎨 Performance Optimizations

### React.memo Applied to:
- App component
- Loading component (3 size variants)
- ProtectedRoute component
- PublicRoute component
- All page components (Home, Admin, Auth, NotFound)
- All layout components (Headers, Footers)

### Code Splitting & Lazy Loading:
```typescript
const Home = lazy(() => import('@pages/Home'));
const Admin = lazy(() => import('@pages/Admin'));
const Auth = lazy(() => import('@pages/Auth'));
```

### Prefetch Hints:
```typescript
<link rel="prefetch" href="/src/pages/Admin/index.tsx" />
```

## 🔐 Redux Store Structure

### Auth Slice (`authSlice.ts`)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Async thunks
- login(credentials)
- register(userData)
- logout()
- fetchProfile()
```

### UI Slice (`uiSlice.ts`)
```typescript
interface UIState {
  theme: 'light' | 'dark';
  sidebar: { isOpen: boolean };
  notifications: Notification[];
  modal: { isOpen: boolean; content: ReactNode | null };
}

// Actions
- toggleTheme()
- toggleSidebar()
- addNotification()
- removeNotification()
- openModal()
- closeModal()
```

## 🔗 API Service Configuration

### Axios Interceptors

**Request Interceptor:**
- Add Authorization header
- Add CSRF token
- Track request for rate limiting

**Response Interceptor:**
- Handle 401 (auto logout)
- Handle token refresh
- Format error messages

## 🛣️ Routing

### Public Routes
- `/` - Home page
- `/auth` - Login/Register

### Protected Routes (require authentication)
- `/admin` - Admin dashboard

### Route Guards
- **ProtectedRoute**: Redirect to `/auth` if not authenticated
- **PublicRoute**: Redirect to `/admin` if already authenticated

## 🎯 Custom Hooks

### `useAuth()`
```typescript
const {
  user,
  isAuthenticated,
  login,
  register,
  logout,
  loading,
  error
} = useAuth();
```

### `useApi(url, options)`
```typescript
const { data, error, loading, refetch } = useApi('/users', {
  method: 'GET',
  immediate: true,
});
```

### `useDebounce(value, delay)`
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);
```

### `useLocalStorage(key, initialValue)`
```typescript
const [value, setValue] = useLocalStorage('theme', 'light');
```

## 🔒 Security Utilities

### Encryption (`utils/security.ts`)
```typescript
encryptData(data: any): string
decryptData(encrypted: string): any
generateCSRFToken(): string
validateCSRFToken(token: string): boolean
checkRateLimit(endpoint: string): boolean
```

## 🎨 Tailwind CSS Setup

**Configured with:**
- Custom colors
- Font families
- Responsive breakpoints
- Dark mode support
- Animation utilities

## 📱 Responsive Design

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## ✅ TypeScript Configuration

- **Target**: ES2020
- **JSX**: react-jsx (React 19 transform)
- **Strict Mode**: Partially enabled for gradual migration
- **Path Aliases**: `@/`, `@components`, `@pages`, `@services`, etc.

## 🧪 Testing

```bash
# TODO: Add testing framework (Vitest)
npm test
```

## 🎯 Next Steps (TODO)

1. **Authentication Pages**
   - Login form with validation
   - Register form with password strength
   - Forgot password flow
   - Email verification

2. **Admin Dashboard**
   - User management
   - Statistics/charts
   - Settings panel
   - Profile management

3. **UI Components**
   - Button component
   - Input/Form components
   - Modal component
   - Toast notifications
   - Table component

4. **Features**
   - User profile editing
   - Avatar upload
   - Theme switcher
   - Multi-language support (i18n)

5. **Testing**
   - Unit tests (Vitest)
   - Component tests (React Testing Library)
   - E2E tests (Playwright)

## 📄 License

ISC

## 👨‍💻 Team

Clean architecture với full TypeScript và Redux Toolkit - sẵn sàng cho team development!
