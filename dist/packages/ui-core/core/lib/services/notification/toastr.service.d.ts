import { NbToastrService } from '@nebular/theme';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ToastrService {
    readonly _nbToastrService: NbToastrService;
    readonly _i18nService: I18nService;
    constructor(_nbToastrService: NbToastrService, _i18nService: I18nService);
    /**
     * Displays a success toast message
     * @param message The message or object containing the message to display.
     * @param translationParams Optional translation parameters.
     * @param title The title of the toast message.
     */
    success(message: any, translationParams?: Object, title?: string): void;
    /**
     * Displays a warning toast message
     * @param message The message or object containing the message to display.
     * @param translationParams Optional translation parameters.
     * @param title The title of the toast message.
     */
    warning(message: any, translationParams?: Object, title?: string): void;
    /**
     * Displays a danger (error) toast message
     * @param error The error object or message to display.
     * @param title The title of the toast message.
     * @param translationParams Optional translation parameters.
     */
    danger(error: any, title?: string, translationParams?: Object): void;
    /**
     * Displays an error toast message. Alias for danger method.
     * @param message The message or object containing the message to display.
     * @param title The title of the toast message.
     * @param translationParams Optional translation parameters.
     */
    error(message: any, title?: string, translationParams?: Object): void;
    /**
     * Displays an info toast message
     * @param message The message to display.
     * @param title The title of the toast message.
     * @param options Additional options for the toast message.
     */
    info(message: any, title: string, options?: any): void;
    /**``
     * Extracts the message from a message object or string.
     * @param message The message object or string.
     * @returns The extracted message string.
     */
    private extractMessage;
    /**
     * Extracts the error message from an error object or string.
     * @param error The error object or string.
     * @returns The extracted error message string.
     */
    private extractErrorMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastrService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ToastrService>;
}
