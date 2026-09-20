import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalDataSource } from 'angular2-smart-table';
import { ServerSourceConf } from './server-source.conf';
export declare class ServerDataSource extends LocalDataSource {
    protected http: HttpClient;
    protected conf: ServerSourceConf;
    protected lastRequestCount: number;
    constructor(http: HttpClient, conf?: ServerSourceConf | {});
    count(): number;
    getData(): any[];
    getElements(): Promise<any>;
    /**
     * Extracts array of data from server response
     * @param res
     * @returns {any}
     */
    protected extractDataFromResponse(res: any): Array<any>;
    /**
     * Extracts total rows count from the server response
     * Looks for the count in the headers first, then in the response body
     * @param res
     * @returns {any}
     */
    protected extractTotalFromResponse(res: any): number;
    protected requestElements(): Observable<any>;
    protected createRequestParams(): HttpParams;
    /**
     * Adds sorting parameters to the request based on the sorting configuration.
     *
     * This function processes the `sortConf` configuration and extracts the field
     * and its direction (ascending or descending) to create a sorting object.
     * If a field does not have a valid direction, it will be skipped, and a warning
     * will be logged. The resulting sorting parameters are returned as part of an
     * object that can be used in a request.
     *
     * @returns {Object} An object containing the sorting parameters.
     */
    protected addSortRequestParams(): {
        [key: string]: any;
    };
    /**
     * Add additional smart datatables filters to the request parameters.
     *
     * @returns {Object} The constructed filter object for request parameters.
     */
    protected addFilterRequestParams(): any;
    protected addPagerRequestParams(): {
        [x: string]: number;
    };
}
