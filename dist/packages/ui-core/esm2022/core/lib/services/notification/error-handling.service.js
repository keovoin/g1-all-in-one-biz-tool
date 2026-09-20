import { Injectable } from '@angular/core';
import { HttpStatus } from '@gauzy/contracts';
import { ToastrService } from './toastr.service';
import * as i0 from "@angular/core";
import * as i1 from "./toastr.service";
export class ErrorHandlingService {
    constructor(_toastrService) {
        this._toastrService = _toastrService;
    }
    /**
     * Handles HTTP errors and displays an appropriate message.
     * @param err - The HttpErrorResponse object.
     * @param duration - Duration for which the toast message is displayed.
     */
    handleError(error, duration = 3000) {
        const details = this.getErrorDetails(error);
        this._toastrService.error(details.message, details.title, { duration });
    }
    /**
     * Determines the type of error and sets the appropriate title and content based on the status code.
     * @param err - The HttpErrorResponse object.
     * @returns An object containing the error title and content.
     */
    getErrorDetails(err) {
        let title = 'Error';
        let message = 'An unexpected error occurred';
        // Extracting the error message from response body if available
        if (err.error) {
            if (err.error.message) {
                message = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
            }
            if (err.error.detail) {
                message = err.error.detail;
            }
        }
        // Switch based on the HTTP status code using HttpStatus constants
        switch (err.status) {
            case HttpStatus.BAD_REQUEST:
                title = 'Bad Request';
                message = message || 'The request could not be understood or was missing required parameters.';
                break;
            case HttpStatus.UNAUTHORIZED:
                title = 'Unauthorized';
                message = message || 'Authentication is required and has failed or has not yet been provided.';
                break;
            case HttpStatus.FORBIDDEN:
                title = 'Forbidden';
                message = message || 'You do not have permission to access the requested resource.';
                break;
            case HttpStatus.NOT_FOUND:
                title = 'Not Found';
                message = message || 'The requested resource could not be found.';
                break;
            case HttpStatus.CONFLICT:
                title = 'Conflict';
                message = message || 'There was a conflict with the current state of the resource.';
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                title = 'Server Error';
                message = message || 'An error occurred on the server.';
                break;
            case HttpStatus.GATEWAY_TIMEOUT:
                title = 'Gateway Timeout';
                message = message || 'The server took too long to respond.';
                break;
            case HttpStatus.SERVICE_UNAVAILABLE:
                title = 'Service Unavailable';
                message = message || 'The service is temporarily unavailable. Please try again later.';
                break;
            case 0:
                title = 'Network Error';
                message = 'Unable to connect to the server. Please check your network connection.';
                break;
            default:
                title = 'Error';
                message = message || 'An unexpected error occurred.';
                break;
        }
        // Special handling for HTTP failure responses
        if (message.includes('Http failure response')) {
            title = 'Connection Error';
            message = 'Lost connection with the server. Please try again later.';
        }
        return { title, message };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ErrorHandlingService, deps: [{ token: i1.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ErrorHandlingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ErrorHandlingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.ToastrService }] });
//# sourceMappingURL=error-handling.service.js.map