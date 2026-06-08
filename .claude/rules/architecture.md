## Folder Structure
src/
  environments/
    environment.ts             ← dev config values
    environment.prod.ts        ← prod config values
  app/
    core/                      ← domain logic, models, state
      models/
      services/
    features/                  ← one folder per feature
      dashboard/
        components/            ← dumb/presentational components
          policy-table/
            policy-table.component.ts
            policy-table.component.spec.ts
          filter-bar/
          summary-panel/
        dashboard.component.ts
        dashboard.component.spec.ts
    infrastructure/            ← technical cross-cutting concerns
      logging/                 ← LoggingService, severity levels
        logging.service.ts
        logging.service.spec.ts
      storage/                 ← StorageService, localStorage abstraction
        storage.service.ts
        storage.service.spec.ts
      error/                   ← error models, error handler service
      i18n/                    ← all user-visible strings as typed constants
      config/                  ← AppConfig, injection token
        app.config.ts
      interceptors/            ← HTTP error normalisation, request logging
    shared/                    ← reusable dumb components, pipes, directives
    app.component.ts
    app.routes.ts
  main.ts                      ← bootstraps app, provides APP_CONFIG from environment
  styles/
    _tokens.primitives.scss    ← raw design values
    _tokens.semantic.scss      ← intent-named tokens
    _themes.scss               ← light and dark overrides
  styles.scss                  ← global entry point