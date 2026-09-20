import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class JobBudgetPipe implements PipeTransform {
    private readonly currencyPipe;
    /**
     * Convert string to currency format
     *
     * @param budget
     * @param currency
     * @returns
     */
    transform(budget: string, currency?: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobBudgetPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<JobBudgetPipe, "budget", true>;
}
