import { ToastrService } from './toastr.service';
import * as i0 from "@angular/core";
export declare class ErrorHandlingService {
    private _toastrService;
    constructor(_toastrService: ToastrService);
    /**
     * Handles HTTP errors and displays an appropriate message.
     * @param err - The HttpErrorResponse object.
     * @param duration - Duration for which the toast message is displayed.
     */
    handleError(error: any, duration?: number): void;
    /**
     * Determines the type of error and sets the appropriate title and content based on the status code.
     * @param err - The HttpErrorResponse object.
     * @returns An object containing the error title and content.
     */
    private getErrorDetails;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorHandlingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ErrorHandlingService>;
}
