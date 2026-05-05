# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start            # Dev server at http://localhost:3000 (hot reload)
yarn build            # Production bundle → build/bundle/*.zip
yarn deploy           # Deploy built app to DHIS2 instance
yarn test             # Unit tests (Vitest)
yarn test src/utils/__tests__/time.test.js  # Run a single test file
yarn lint             # ESLint + Prettier checks (d2-style)
yarn format           # Apply d2-style formatting
yarn cy:open          # Cypress E2E test runner (requires dev server)
yarn cy:run           # Cypress E2E headless
yarn cy:open:component  # Cypress component test runner
yarn cy:run:component   # Cypress component tests headless
```

**After any file edit**, run `npx d2-style apply <file>` to format it. The VSCode format-on-save hook is not reliable.

## Architecture

This is a DHIS2 app for importing and exploring weather/climate data. Data comes from two sources: **Google Earth Engine (GEE)** with ERA5-Land, CHIRPS, MODIS, etc., and **ENACTS** (an external climate data service, available for DHIS2 v2.41+). Data flows into DHIS2 data values.

The app has four main sections, each a top-level directory under `src/components/`:

-   **explore/** — Interactive charts of climate data for a selected org unit and period. Tabs for temperature, precipitation, humidity, heat stress, vegetation, landcover, elevation, forecast, climate change.
-   **import/** — Wizard to select dataset + period + org units, preview extracted values, then bulk-import into DHIS2.
-   **check/** — Validate/review already-imported data.
-   **settings/** — User preferences (start page, timezone).

### Routing

React Router 6 with `createHashRouter` (hash URLs for DHIS2 embedding compatibility). Loader functions (`orgUnitLoader`, `checkPlaceLoader`) prefetch org unit data before rendering. Routes defined in `src/components/Routes.jsx`.

### State management

-   **Zustand** (`src/store/exploreStore.js`) for explore-section UI state (selected org unit, active tab, periods, vegetation/landcover types). Uses a `setIfChanged` pattern to avoid redundant re-renders.
-   **@dhis2/app-runtime** hooks (`useDataQuery`, `useDataEngine`) for DHIS2 API calls.
-   **TanStack React Query** (`useQuery`) inside `useEnactsData` for ENACTS HTTP fetches with caching.

### Data fetching hooks (`src/hooks/`)

All hooks return `{ data, loading, error }`:

| Hook                           | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `useEarthEngineToken`          | Fetches GEE OAuth token from DHIS2 `/tokens/google`                     |
| `useEarthEngineTimeSeries`     | Time series chart data from GEE                                         |
| `useEarthEngineClimateNormals` | Historical normals from GEE                                             |
| `useEarthEngineData`           | Point/area data from GEE for import                                     |
| `useEnactsData`                | Data from external ENACTS service                                       |
| `useRoutesAPI`                 | DHIS2 routes API (v2.41+) for ENACTS endpoint discovery                 |
| `useOrgUnits`                  | GeoJSON features for org units (debounced, 250ms)                       |
| `useAppSettings`               | Read/write app settings from DHIS2 dataStore (`CLIMATE_DATA` namespace) |

### Earth Engine integration (`src/utils/ee-utils.js`, `src/lib/earthengine.js`)

The GEE JavaScript client library (`src/lib/earthengine.js`, 1.9MB bundled) runs client-side. `ee-utils.js` wraps it: builds image collection queries, applies reducers (mean/sum/stdDev), and evaluates results via a custom `getInfo()` promise wrapper. Dataset metadata (collections, bands, units, scale factors) lives in `src/data/earth-engine-datasets.js`.

### Version gating

`DataSourcesProvider` (`src/components/DataSourcesProvider.jsx`) checks `serverVersion.minor` to conditionally enable features:

-   ENACTS support requires `minor >= 41` (DHIS2 2.41+)
-   Some routes API calls check `minor >= 40`

### Data utilities (`src/utils/`)

-   `calc.js` — Unit conversions: Kelvin→Celsius, precipitation m→mm, humidity calculations, NDVI/EVI parsing
-   `time.js` — Multi-calendar support (Gregorian, Nepali, Ethiopic, etc.) using `@dhis2/multi-calendar-dates`; period type constants (DAILY, WEEKLY, MONTHLY, YEARLY, HOURLY, SIXTEEN_DAYS)
-   `chart.js` — Highcharts configuration builders
-   `toGeoJson.js` — Convert DHIS2 geoFeatures API response to GeoJSON

### Styling

CSS Modules (`.module.css` co-located with components). `@dhis2/ui` provides `CssReset` and `CssVariables` for theming.

### i18n

37+ language translations in `src/locales/`, synced with Transifex. Use `d2-i18n` for all user-facing strings.

## Tests

-   **Unit tests** (Vitest): `src/**/__tests__/*.test.js` — primarily for utility functions in `src/utils/`
-   **Cypress E2E**: `cypress/e2e/**/*.cy.js` — smoke tests, dataset tests, import flow
-   **Cypress component tests**: `src/**/*.cy.jsx` — component-level tests using Vite + jsdom

Cypress uses `cypress.env.json` (not committed) for DHIS2 instance credentials.

## Jira

When creating Jira issues in the CLIM project, always include the **"Climate App"** component.
