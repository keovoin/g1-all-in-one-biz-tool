import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/i18n";
export class ToastrService {
    constructor(_nbToastrService, _i18nService) {
        this._nbToastrService = _nbToastrService;
        this._i18nService = _i18nService;
    }
    /**
     * Displays a success toast message
     * @param message The message or object containing the message to display.
     * @param translationParams Optional translation parameters.
     * @param title The title of the toast message.
     */
    success(message, translationParams = {}, title) {
        const displayMessage = this.extractMessage(message);
        this._nbToastrService.primary(this._i18nService.translate(displayMessage, translationParams), this._i18nService.translate(title || 'TOASTR.TITLE.SUCCESS'));
    }
    /**
     * Displays a warning toast message
     * @param message The message or object containing the message to display.
     * @param translationParams Optional translation parameters.
     * @param title The title of the toast message.
     */
    warning(message, translationParams = {}, title) {
        const displayMessage = this.extractMessage(message);
        this._nbToastrService.warning(this._i18nService.translate(displayMessage, translationParams), this._i18nService.translate(title || 'TOASTR.TITLE.WARNING'));
    }
    /**
     * Displays a danger (error) toast message
     * @param error The error object or message to display.
     * @param title The title of the toast message.
     * @param translationParams Optional translation parameters.
     */
    danger(error, title = 'TOASTR.TITLE.ERROR', translationParams = {}) {
        const displayMessage = this.extractErrorMessage(error);
        this._nbToastrService.danger(this._i18nService.translate(displayMessage, translationParams), this._i18nService.translate(title || 'TOASTR.TITLE.ERROR'));
    }
    /**
     * Displays an error toast message. Alias for danger method.
     * @param message The message or object containing the message to display.
     * @param title The title of the toast message.
     * @param translationParams Optional translation parameters.
     */
    error(message, title = 'TOASTR.TITLE.ERROR', translationParams = {}) {
        this.danger(message, title, translationParams);
    }
    /**
     * Displays an info toast message
     * @param message The message to display.
     * @param title The title of the toast message.
     * @param options Additional options for the toast message.
     */
    info(message, title, options) {
        options = {
            duration: 5000,
            preventDuplicates: true,
            translationParams: {},
            ...options
        };
        this._nbToastrService.info(this._i18nService.translate(message, options.translationParams), this._i18nService.translate(title || 'TOASTR.TITLE.INFO'), options);
    }
    /**``
     * Extracts the message from a message object or string.
     * @param message The message object or string.
     * @returns The extracted message string.
     */
    extractMessage(message) {
        if (message && message.message && typeof message.message === 'string') {
            return message.message;
        }
        return message;
    }
    /**
     * Extracts the error message from an error object or string.
     * @param error The error object or string.
     * @returns The extracted error message string.
     */
    extractErrorMessage(error) {
        // A NestJS ValidationPipe 400 carries `message` as an ARRAY of validator
        // sentences. Before this branch existed those fell through to Angular's
        // synthetic "Http failure response for <url>: 400 OK" — the least useful
        // string in the whole object.
        if (Array.isArray(error?.error?.message) && error.error.message.length) {
            return error.error.message.join('; ');
        }
        if (error.error && error.error.message && typeof error.error.message === 'string') {
            return error.error.message;
        }
        else if (error.message && typeof error.message === 'string') {
            return error.message;
        }
        return error;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToastrService, deps: [{ token: i1.NbToastrService }, { token: i2.I18nService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToastrService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToastrService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.NbToastrService }, { type: i2.I18nService }] });
//# sourceMappingURL=toastr.service.js.map