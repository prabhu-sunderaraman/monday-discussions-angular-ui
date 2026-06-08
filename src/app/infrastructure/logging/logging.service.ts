import { Injectable, inject } from '@angular/core';

import { APP_CONFIG } from '../config/app.config';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

/**
 * Central logging sink for the whole application. This is the single sanctioned
 * place that may touch the `console` API — everywhere else must inject and use
 * this service. In production, only warnings and errors are emitted.
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly minLevel = inject(APP_CONFIG).production ? LogLevel.Warn : LogLevel.Debug;

  debug(message: string, ...context: readonly unknown[]): void {
    this.write(LogLevel.Debug, message, context);
  }

  log(message: string, ...context: readonly unknown[]): void {
    this.write(LogLevel.Info, message, context);
  }

  warn(message: string, ...context: readonly unknown[]): void {
    this.write(LogLevel.Warn, message, context);
  }

  error(message: string, ...context: readonly unknown[]): void {
    this.write(LogLevel.Error, message, context);
  }

  private write(level: LogLevel, message: string, context: readonly unknown[]): void {
    if (level < this.minLevel) {
      return;
    }
    // The only sanctioned use of `console` in the codebase.
    // eslint-disable-next-line no-console
    const sink = this.sinkFor(level);
    sink(message, ...context);
  }

  private sinkFor(level: LogLevel): (message: string, ...rest: readonly unknown[]) => void {
    /* eslint-disable no-console */
    switch (level) {
      case LogLevel.Debug:
        return console.debug.bind(console);
      case LogLevel.Info:
        return console.info.bind(console);
      case LogLevel.Warn:
        return console.warn.bind(console);
      case LogLevel.Error:
        return console.error.bind(console);
    }
    /* eslint-enable no-console */
  }
}
