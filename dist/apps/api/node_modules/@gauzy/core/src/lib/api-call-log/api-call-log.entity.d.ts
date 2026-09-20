import { EntityRepositoryType } from '@mikro-orm/core';
import { IApiCallLog, ID, IUser, JsonData, RequestMethod } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmApiCallLogRepository } from './repository/mikro-orm-api-call-log.repository';
export declare class ApiCallLog extends TenantOrganizationBaseEntity implements IApiCallLog {
    [EntityRepositoryType]?: MikroOrmApiCallLogRepository;
    /**
     * Correlation ID to track the request across services
     */
    correlationId: ID;
    /**
     * The request URL that was called
     */
    url: string;
    /**
     * The HTTP method (GET, POST, etc.) used in the request.
     * It is transformed from enum to string using HttpMethodTransformerPipe.
     */
    method: RequestMethod;
    /**
     * Request headers stored as JSON string
     */
    requestHeaders: JsonData;
    /**
     * Request body stored as JSON string
     */
    requestBody: JsonData;
    /**
     * Response body stored as JSON string
     */
    responseBody: JsonData;
    /**
     * The HTTP status code returned from the request
     */
    statusCode: number;
    /**
     * The timestamp when the request was initiated
     */
    requestTime: Date;
    /**
     * The timestamp when the response was completed
     */
    responseTime: Date;
    /**
     * IP Address of the client making the request
     */
    ipAddress: string;
    /**
     * The protocol used in the request (HTTP, HTTPS)
     */
    protocol: string;
    /**
     * User-Agent string of the client making the request.
     * This could be a browser, desktop app, Postman, or any other API client.
     */
    userAgent: string;
    /**
     * Origin from where the request was initiated (web, mobile, desktop, etc.).
     */
    origin: string;
    /**
     * User who performed the action, if applicable.
     *
     * This relationship is nullable and uses the User entity.
     */
    user?: IUser;
    /**
     * The ID of the user who performed the action.
     * This column stores the user ID as a foreign key, if applicable.
     */
    userId?: ID;
}
