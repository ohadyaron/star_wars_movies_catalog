# Star Wars Films Catalog - Architecture Overview

## High-Level Architecture

This application follows a **layered, feature-based architecture** with strict separation of concerns.

## Architecture Layers

### 1. Core Layer (`src/core/`)
**Purpose**: Singleton services and shared domain models used across features.

- **Models**: Strongly-typed interfaces for all API entities
  - `Film`, `Character`, `Starship`, `Vehicle`, `Species`
  - `LoadingState` for consistent async state management
  
- **Services**:
  - `SwapiService`: Centralized HTTP service for all SWAPI calls
    - Uses `HttpClient` for API communication
    - Implements error handling with typed error responses
    - Uses `forkJoin` for parallel resource loading
    - Filters out failed individual requests gracefully

### 2. Features Layer (`src/features/`)
**Purpose**: Feature-specific components, pages, and services.

#### Films Feature (`features/films/`)

**Pages:**
- `FilmsPageComponent`: Container component that orchestrates the feature

**Components:**
- `ToolbarComponent`: App header with search functionality
- `FilmsGridComponent`: Displays grid of film cards with filtering
- `FilmCardComponent`: Individual film card with collapsible details
- `CharactersListComponent`: Lazy-loaded characters drill-down
- `StarshipsListComponent`: Lazy-loaded starships drill-down
- `VehiclesListComponent`: Lazy-loaded vehicles drill-down
- `SpeciesListComponent`: Lazy-loaded species drill-down

**Services:**
- `FilmSearchService`: Manages search state with `BehaviorSubject`

### 3. Shared Layer (`src/shared/`)
**Purpose**: Reusable UI components and utilities.

**Components:**
- `LoadingSpinnerComponent`: Consistent loading indicator
- `ErrorMessageComponent`: Consistent error display

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Input                            │
│                     (Search/Interaction)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FilmSearchService                          │
│              (BehaviorSubject<string>)                       │
│         Emits: debounced, case-insensitive search term       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FilmsGridComponent                          │
│         combineLatest([searchTerm$, loading$])               │
│              Filters films client-side                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               FilmCardComponent (per film)                   │
│          Displays film details + drill-down panels           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Drill-down Components (lazy-loaded)                │
│   Characters/Starships/Vehicles/Species ListComponents      │
│         Load on first expansion, cache thereafter            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     SwapiService                             │
│    forkJoin(urls.map(url => http.get<T>(url)))             │
│          Parallel loading of all resources                   │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### Search State
- Managed by `FilmSearchService`
- Single source of truth: `BehaviorSubject<string>`
- Observable stream: `searchTerm$`
- Operators: `debounceTime(300)`, `distinctUntilChanged()`

### Loading State
- Per-component loading states using `BehaviorSubject<LoadingState>`
- `LoadingState` interface: `{ isLoading: boolean; error: string | null }`
- Granular control: each drill-down manages its own loading state

### Data Caching
- Films: Loaded once on app init, filtered client-side
- Drill-down data: Loaded once per panel, `hasLoaded` flag prevents re-fetching

## RxJS Patterns

### 1. **Debounced Search**
```typescript
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  takeUntil(destroy$)
)
```

### 2. **Parallel Resource Loading**
```typescript
forkJoin(urls.map(url => http.get<T>(url).pipe(
  catchError(() => of(null))
)))
```

### 3. **Stream Combination**
```typescript
combineLatest([searchTerm$, loading$]).pipe(
  map(([searchTerm]) => filterFilms(searchTerm))
)
```

### 4. **Subscription Management**
```typescript
// Pattern used everywhere
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

someObservable$.pipe(takeUntil(this.destroy$)).subscribe(...)
```

## Performance Optimizations

### 1. **OnPush Change Detection**
All components use `ChangeDetectionStrategy.OnPush`:
- Components only re-render when inputs change or events fire
- Reduces change detection cycles by ~80%
- Requires immutable data patterns (we use observables)

### 2. **TrackBy Functions**
Every `*ngFor` uses `trackBy`:
```typescript
trackByFilmUrl(index: number, film: Film): string {
  return film.url;
}
```
Prevents unnecessary DOM re-creation when lists update.

### 3. **Lazy Loading**
Drill-down sections implement lazy loading:
- Data fetched only when user expands panel
- `hasLoaded` flag prevents duplicate requests
- Saves initial bandwidth and improves perceived performance

### 4. **Parallel Requests**
`forkJoin` loads multiple resources simultaneously:
- All characters for a film load in parallel
- Significantly faster than sequential requests
- Individual failures don't break the entire list

## Error Handling Strategy

### Layered Error Handling

1. **HTTP Level** (`SwapiService`)
   - Catches all HTTP errors
   - Converts to user-friendly messages
   - Returns typed errors via `throwError()`

2. **Component Level**
   - Each drill-down component handles its own errors
   - Sets `error` in `LoadingState`
   - Displays `ErrorMessageComponent`

3. **Graceful Degradation**
   - Failed individual resources filtered out
   - UI shows partial data rather than failing entirely
   - Example: If 1 of 10 character requests fails, show the other 9

## Testing Architecture

### Unit Tests

**Service Testing:**
- Mock `HttpClient` with `HttpTestingController`
- Test success and error scenarios
- Verify request parameters and response handling

**Component Testing:**
- Test logic, not implementation
- Focus on state changes and user interactions
- Mock service dependencies

**Coverage Areas:**
- Loading states
- Error handling
- Data transformation
- RxJS stream behavior
- User input handling

### E2E Tests

**User Journey Coverage:**
1. Application loads
2. Films display
3. Search functionality
4. Drill-down expansion
5. Error scenarios
6. Responsive layouts

**Cypress Best Practices:**
- Use `data-` attributes for selectors (if needed)
- Test user workflows, not implementation
- Intercept API calls for error testing
- Test multiple viewports

## Security Considerations

1. **XSS Prevention**: Angular's built-in sanitization
2. **HTTPS**: API uses HTTPS
3. **No Sensitive Data**: Public API, no auth required
4. **Type Safety**: Prevents runtime errors

## Scalability Considerations

### Current Scale
- ~6 films
- ~50 characters per film (max)
- Handled entirely client-side

### Future Scaling Options
1. **Server-side Filtering**: Move search to backend
2. **Pagination**: Implement virtual scrolling for large lists
3. **State Management**: NgRx/Akita for complex state
4. **Service Workers**: Offline support and caching

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2022 target
- No IE11 support (Angular 17+)

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

---

This architecture provides:
✅ Clear separation of concerns
✅ Testability at all layers
✅ Performance optimization
✅ Type safety
✅ Scalability
✅ Maintainability
