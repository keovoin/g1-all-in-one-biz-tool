import { Inject, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { GAUZY_ENV } from '@gauzy/ui-config';
import * as i0 from "@angular/core";
export class SentryErrorHandler {
    constructor(environment) {
        this.environment = environment;
    }
    /**
     * Handles an error by capturing it with Sentry and optionally showing a report dialog.
     * @param error - The error to handle.
     */
    handleError(error) {
        // Check if Sentry DSN is provided in the environment configuration
        if (this.environment.SENTRY_DSN) {
            // Capture the error with Sentry and get the event ID
            const eventId = Sentry.captureException(error.originalError || error);
            // Must provide a valid eventId when calling showReportDialog
            Sentry.showReportDialog({ eventId });
        }
        // Rethrow the error to ensure that it is still propagated
        throw error;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SentryErrorHandler, deps: [{ token: GAUZY_ENV }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SentryErrorHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SentryErrorHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [GAUZY_ENV]
                }] }] });
//# sourceMappingURL=sentry-error.handler.js.map