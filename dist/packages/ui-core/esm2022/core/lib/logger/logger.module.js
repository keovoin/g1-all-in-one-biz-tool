import { NgModule } from '@angular/core';
import { LOGGER_CONTEXT } from './logger.tokens';
import * as i0 from "@angular/core";
/**
 * Provides a default logger context (prefix) for the current injector subtree.
 * Use in component or feature `providers` for NestJS-style prefixed logging.
 *
 * @example
 * ```ts
 * @Component({
 *   providers: [provideLoggerContext('MyComponent')],
 * })
 * export class MyComponent {
 *   constructor(private readonly logger: LoggerService) {}
 *   // this.logger.log('hello') => "[MyComponent] hello"
 * }
 * ```
 */
export function provideLoggerContext(context) {
    return { provide: LOGGER_CONTEXT, useValue: context };
}
/**
 * Angular logger module, similar to NestJS `LoggerModule`.
 *
 * Provides a root-level {@link LoggerService} with optional context/prefix support.
 * Use {@link LoggerService.withContext} for a NestJS-style prefixed logger, or provide
 * {@link LOGGER_CONTEXT} in a component subtree for a default prefix.
 *
 * The service is `providedIn: 'root'`, so importing this module is optional;
 * you can inject {@link LoggerService} and optionally use {@link provideLoggerContext}
 * without importing the module.
 *
 * @example
 * ```ts
 * @NgModule({
 *   imports: [LoggerModule.forRoot()],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * ```ts
 * // In a component
 * private readonly log = inject(LoggerService).withContext('MyComponent');
 * this.log.log('Initialized');
 * this.log.error('Failed', error.stack);
 * ```
 */
export class LoggerModule {
    /**
     * Configures the logger for the root application.
     * LoggerService is already providedIn: 'root'; this method exists for API symmetry with NestJS.
     */
    static forRoot() {
        return {
            ngModule: LoggerModule,
            providers: []
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LoggerModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=logger.module.js.map