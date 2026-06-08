import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_CONFIG } from '../config/app.config';
import { LoggingService } from './logging.service';

function configure(production: boolean): LoggingService {
  TestBed.configureTestingModule({
    providers: [
      LoggingService,
      { provide: APP_CONFIG, useValue: { production, apiBaseUrl: '/api' } },
    ],
  });
  return TestBed.inject(LoggingService);
}

describe('LoggingService', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('routes each level to the matching console sink in development', () => {
    const logger = configure(false);

    logger.debug('d', 1);
    logger.log('i');
    logger.warn('w');
    logger.error('e', { status: 500 });

    expect(console.debug).toHaveBeenCalledWith('d', 1);
    expect(console.info).toHaveBeenCalledWith('i');
    expect(console.warn).toHaveBeenCalledWith('w');
    expect(console.error).toHaveBeenCalledWith('e', { status: 500 });
  });

  it('suppresses debug and info in production but keeps warn and error', () => {
    const logger = configure(true);

    logger.debug('d');
    logger.log('i');
    logger.warn('w');
    logger.error('e');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
