import { HttpParams } from '@angular/common/http';
/**
 * Builds HttpParams from a nested object or array recursively.
 */
export declare function buildHttpParams(query: any, prefix?: string): HttpParams;
