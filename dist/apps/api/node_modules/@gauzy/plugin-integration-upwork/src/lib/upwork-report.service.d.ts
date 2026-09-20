import { IUpworkApiConfig, IUpworkDateRange } from '@gauzy/contracts';
export declare class UpworkReportService {
    /**
     * Fetches detailed time reports for a specific freelancer.
     *
     * @param {IUpworkApiConfig} config - Configuration object for Upwork API, including access tokens and API keys.
     * @param {string} providerId - The ID of the freelancer for whom the report is being fetched.
     * @param {IUpworkDateRange} dateRange - The start and end dates for the report.
     * @returns {Promise<any>} - Returns the time report data or throws an exception if an error occurs.
     * @throws {BadRequestException} - Thrown if the report cannot be fetched.
     */
    getFullReportByFreelancer(config: IUpworkApiConfig, providerId: string, dateRange: IUpworkDateRange): Promise<any>;
    /**
     * Fetches limited time reports (hours only) for a specific freelancer.
     *
     * @param {IUpworkApiConfig} config - Configuration object for Upwork API, including access tokens and API keys.
     * @param {string} providerId - The ID of the freelancer for whom the report is being fetched.
     * @param {IUpworkDateRange} dateRange - The start and end dates for the report.
     * @returns {Promise<any>} - Returns the time report data or throws an exception if an error occurs.
     * @throws {BadRequestException} - Thrown if the report cannot be fetched.
     */
    getLimitedReportByFreelance(config: IUpworkApiConfig, providerId: string, dateRange: IUpworkDateRange): Promise<any>;
    /**
     * Fetches billing reports for a freelancer.
     *
     * @param {IUpworkApiConfig} config - Configuration object for Upwork API, including access tokens and API keys.
     * @param {string} providerReferenceId - The reference ID of the freelancer for whom the billing report is being fetched.
     * @param {IUpworkDateRange} dateRange - The start and end dates for the report.
     * @returns {Promise<any>} - Returns the billing report data or throws an exception if an error occurs.
     * @throws {BadRequestException} - Thrown if the billing report cannot be fetched.
     */
    getBillingReportByFreelancer(config: IUpworkApiConfig, providerReferenceId: string, dateRange: IUpworkDateRange): Promise<any>;
    /**
     * Fetches earning reports for a freelancer.
     *
     * @param {IUpworkApiConfig} config - Configuration object for the Upwork API, including API keys and tokens.
     * @param {string} providerReferenceId - The reference ID of the freelancer for whom the earning report is being fetched.
     * @param {IUpworkDateRange} dateRange - The start and end dates for the report.
     * @returns {Promise<any>} - Returns the earning report data or throws an exception if an error occurs.
     * @throws {BadRequestException} - Thrown if the earning report cannot be fetched.
     */
    getEarningReportByFreelancer(config: IUpworkApiConfig, providerReferenceId: string, dateRange: IUpworkDateRange): Promise<any>;
}
