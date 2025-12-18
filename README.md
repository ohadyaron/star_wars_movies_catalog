# Star Wars Films Catalog

A production-ready Angular Single Page Application that displays Star Wars films from the SWAPI (Star Wars API). Built with Angular 17, TypeScript, RxJS, Angular Material, and standalone components.

## 🚀 Features

- **Single Route Application** - Clean, focused SPA on root route (/)
- **Real-time Search** - Debounced (300ms), case-insensitive film search
- **Responsive Grid Layout** - Adaptive film cards using Angular Material
- **Lazy-Loaded Drill-downs** - Characters, Starships, Vehicles, and Species load on-demand
- **OnPush Change Detection** - Performance-optimized throughout
- **Comprehensive Testing** - Unit tests (Karma/Jasmine) and E2E tests (Cypress)
- **Strict TypeScript** - No `any` types, full type safety
- **Standalone Components** - Modern Angular architecture (no NgModules)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## 🛠️ Installation

```bash
# Install dependencies
npm install
```

## 🏃 Running the Application

```bash
# Development server
npm start

# Navigate to http://localhost:4200
```

## 🧪 Testing

### Unit Tests (Karma + Jasmine)

```bash
# Run tests in watch mode
npm test

# Run tests in CI mode (single run, headless)
npm run test:ci
```

### E2E Tests (Cypress)

```bash
# Open Cypress Test Runner
npm run e2e

# Run Cypress tests in headless mode
npm run e2e:ci
```

## 🏗️ Build

```bash
# Production build
npm run build

# Output will be in dist/star-wars-movies-catalog
```

## 📁 Project Structure

```
star-wars-movies-catalog/
├── cypress/                          # E2E tests
│   ├── e2e/
│   │   └── films.cy.ts              # Film catalog E2E tests
│   └── support/
│       ├── commands.ts
│       └── e2e.ts
├── src/
│   ├── app/
│   │   ├── app.component.ts         # Root component
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.config.ts            # Application configuration
│   │   └── app.routes.ts            # Route definitions
│   ├── core/                         # Core layer (singleton services)
│   │   ├── models/
│   │   │   ├── character.model.ts
│   │   │   ├── film.model.ts
│   │   │   ├── loading-state.model.ts
│   │   │   ├── species.model.ts
│   │   │   ├── starship.model.ts
│   │   │   └── vehicle.model.ts
│   │   └── services/
│   │       ├── swapi.service.ts     # Centralized API service
│   │       └── swapi.service.spec.ts
│   ├── features/                     # Feature modules
│   │   └── films/
│   │       ├── components/
│   │       │   ├── characters-list/
│   │       │   │   ├── characters-list.component.ts
│   │       │   │   ├── characters-list.component.html
│   │       │   │   ├── characters-list.component.scss
│   │       │   │   └── characters-list.component.spec.ts
│   │       │   ├── film-card/
│   │       │   │   ├── film-card.component.ts
│   │       │   │   ├── film-card.component.html
│   │       │   │   ├── film-card.component.scss
│   │       │   │   └── film-card.component.spec.ts
│   │       │   ├── films-grid/
│   │       │   │   ├── films-grid.component.ts
│   │       │   │   ├── films-grid.component.html
│   │       │   │   ├── films-grid.component.scss
│   │       │   │   └── films-grid.component.spec.ts
│   │       │   ├── species-list/
│   │       │   │   ├── species-list.component.ts
│   │       │   │   ├── species-list.component.html
│   │       │   │   └── species-list.component.scss
│   │       │   ├── starships-list/
│   │       │   │   ├── starships-list.component.ts
│   │       │   │   ├── starships-list.component.html
│   │       │   │   ├── starships-list.component.scss
│   │       │   │   └── starships-list.component.spec.ts
│   │       │   ├── toolbar/
│   │       │   │   ├── toolbar.component.ts
│   │       │   │   ├── toolbar.component.html
│   │       │   │   ├── toolbar.component.scss
│   │       │   │   └── toolbar.component.spec.ts
│   │       │   └── vehicles-list/
│   │       │       ├── vehicles-list.component.ts
│   │       │       ├── vehicles-list.component.html
│   │       │       └── vehicles-list.component.scss
│   │       ├── pages/
│   │       │   └── films-page/
│   │       │       ├── films-page.component.ts
│   │       │       ├── films-page.component.html
│   │       │       ├── films-page.component.scss
│   │       │       └── films-page.component.spec.ts
│   │       └── services/
│   │           ├── film-search.service.ts
│   │           └── film-search.service.spec.ts
│   ├── shared/                       # Shared components/utilities
│   │   └── components/
│   │       ├── error-message/
│   │       │   ├── error-message.component.ts
│   │       │   ├── error-message.component.html
│   │       │   ├── error-message.component.scss
│   │       │   └── error-message.component.spec.ts
│   │       └── loading-spinner/
│   │           ├── loading-spinner.component.ts
│   │           ├── loading-spinner.component.html
│   │           ├── loading-spinner.component.scss
│   │           └── loading-spinner.component.spec.ts
│   ├── environments/
│   │   ├── environment.ts           # Production environment
│   │   └── environment.development.ts
│   ├── index.html
│   ├── main.ts                      # Application bootstrap
│   └── styles.scss                  # Global styles + Material theme
├── angular.json
├── cypress.config.ts
├── karma.conf.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

## 🎯 Key Technical Decisions

### 1. **Architecture Pattern**

The project follows a **layered architecture**:

- **Core Layer**: Singleton services and models used across features
- **Features Layer**: Feature-specific components, pages, and services
- **Shared Layer**: Reusable UI components and utilities

### 2. **Data Flow**

```
User Input (Search)
    ↓
FilmSearchService (BehaviorSubject)
    ↓
FilmsGridComponent (combineLatest)
    ↓
FilmCardComponent
    ↓
Drill-down Components (lazy-load on expand)
    ↓
SwapiService (forkJoin for parallel requests)
    ↓
Display Data
```

**Key Points:**
- Search uses `debounceTime(300)` and `distinctUntilChanged()` to minimize API calls
- Film filtering happens client-side after initial load
- Drill-down sections use lazy loading - data fetched only on first expansion
- `forkJoin` loads all related resources (e.g., all characters) in parallel
- `switchMap` ensures proper async flow without nested subscriptions

### 3. **Lazy Loading Strategy**

Each drill-down component:
1. Initializes with `hasLoaded = false`
2. Subscribes to panel `opened` event
3. Checks if data already loaded
4. If not, triggers API request via `SwapiService`
5. Sets `hasLoaded = true` to prevent duplicate requests

**Benefits:**
- Reduced initial page load
- Bandwidth savings (only load what users view)
- Better performance for films with many related resources

### 4. **Performance Optimizations**

- **OnPush Change Detection**: All components use `ChangeDetectionStrategy.OnPush`
- **TrackBy Functions**: All `*ngFor` directives use `trackBy` to prevent unnecessary re-renders
- **RxJS Best Practices**:
  - Proper subscription cleanup with `takeUntil` pattern
  - No nested subscriptions
  - `forkJoin` for parallel requests
  - `switchMap` for dependent streams
- **Debounced Search**: 300ms debounce prevents excessive filtering

### 5. **Error Handling**

- Per-section error states (each drill-down handles its own errors)
- Global error handling in main films grid
- User-friendly error messages
- Graceful degradation (failed individual character requests don't break the whole list)

### 6. **Testing Strategy**

**Unit Tests:**
- **Services**: Mock `HttpClient` with `HttpTestingController`
- **Components**: Test logic, not implementation details
- Focus on:
  - Loading states
  - Error handling
  - Data transformation
  - User interactions
  - RxJS stream behavior

**E2E Tests:**
- User journey coverage:
  - App loads successfully
  - Films display correctly
  - Search functionality works
  - Drill-downs expand and load data
  - Error scenarios handled
  - Responsive design verified

### 7. **Type Safety**

- Strict TypeScript mode enabled
- No `any` types anywhere
- Strongly-typed interfaces for all API responses
- Type guards for null checks (e.g., filtering out failed requests)

## 🌐 API

Uses **SWAPI (Star Wars API)** via https://swapi.info/api

Endpoints:
- `GET /films` - All films
- `GET /people/:id` - Character details
- `GET /starships/:id` - Starship details
- `GET /vehicles/:id` - Vehicle details
- `GET /species/:id` - Species details

## 📊 Component Hierarchy

```
AppComponent
└── FilmsPageComponent
    ├── ToolbarComponent
    │   └── Search Input (FilmSearchService)
    └── FilmsGridComponent
        └── FilmCardComponent (for each film)
            ├── Film Details
            ├── Opening Crawl (expandable)
            └── Drill-down Panels
                ├── CharactersListComponent (expanded by default)
                ├── StarshipsListComponent
                ├── VehiclesListComponent
                └── SpeciesListComponent
```

## 🎨 Styling Approach

- Angular Material's Indigo-Pink theme
- SCSS for all component styles (no inline styles)
- External style files only (`.component.scss`)
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach with media queries

## 🔒 Production Readiness

✅ Strict TypeScript configuration
✅ No deprecated Angular APIs
✅ Standalone components (modern Angular)
✅ OnPush change detection everywhere
✅ Comprehensive error handling
✅ Loading states for all async operations
✅ Accessibility (aria-labels)
✅ Responsive design
✅ Full test coverage (unit + E2E)
✅ Production build optimization

## 📝 Code Quality

- **Linting**: Angular ESLint rules
- **Formatting**: Consistent code style
- **No Magic Strings**: Constants and enums
- **DRY Principle**: Shared components for loading/error states
- **Single Responsibility**: Each component/service has one clear purpose

## 🚀 Deployment

```bash
# Build for production
npm run build

# Serve the dist/star-wars-movies-catalog folder with any static server
# Example with http-server:
npx http-server dist/star-wars-movies-catalog
```

## 🤝 Contributing

This is a production-ready reference implementation following Angular best practices.

## 📄 License

MIT

---

**Built with ❤️ using Angular 17, TypeScript, RxJS, and Angular Material**
