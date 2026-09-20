import { IBasePerTenantAndOrganizationEntityModel, ID, JsonData } from './base-entity.model';
import { IRelationalUser } from './user.model';
/**
 * Enum representing the HTTP method used in the request.
 */
export declare enum RequestMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    PATCH = 4,
    ALL = 5,
    OPTIONS = 6,
    HEAD = 7,
    SEARCH = 8
}
/**
 * Interface representing an API call log entry.
 */
export interface IApiCallLog extends IBasePerTenantAndOrganizationEntityModel, IRelationalUser {
    correlationId: ID;
    url: string;
    method: RequestMethod;
    statusCode: number;
    requestHeaders: JsonData;
    requestBody: JsonData;
    responseBody: JsonData;
    requestTime: Date;
    responseTime: Date;
    ipAddress: string;
    protocol: string;
    userAgent: string;
    origin: string;
}
