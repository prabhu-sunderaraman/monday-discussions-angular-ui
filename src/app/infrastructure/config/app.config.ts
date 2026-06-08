import { InjectionToken } from '@angular/core';

import { AppEnvironment } from '../../../environments/environment.model';

/**
 * DI token carrying the active environment configuration.
 * Provided from `environment` at bootstrap so services never import
 * environment files directly or hardcode API URLs.
 */
export const APP_CONFIG = new InjectionToken<AppEnvironment>('APP_CONFIG');
