import { ErrorHandler } from '@angular/core';
import { Environment } from '@gauzy/ui-config';
import * as i0 from "@angular/core";
export declare class SentryErrorHandler implements ErrorHandler {
    private readonly environment;
    constructor(environment: Environment);
    /**
     * Handles an error by capturing it with Sentry and optionally showing a report dialog.
     * @param error - The error to handle.
     */
    handleError(error: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SentryErrorHandler, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SentryErrorHandler>;
}
