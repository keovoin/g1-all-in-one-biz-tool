import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiCallLogService } from './api-call-log.service';
export declare class ApiCallLogMiddleware implements NestMiddleware {
    private readonly apiCallLogService;
    private readonly logger;
    constructor(apiCallLogService: ApiCallLogService);
    /**
     * Middleware for logging API requests and responses to the database.
     * This middleware generates a unique `correlationId` for each request
     * and captures key details about the incoming request and outgoing response.
     *
     * @param req The incoming HTTP request object.
     * @param res The outgoing HTTP response object.
     * @param next The next middleware function in the request-response cycle.
     */
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Redacts sensitive fields like passwords and tokens from request data.
     * This function removes or masks sensitive data from headers and body before logging.
     *
     * @param {any} data - The data object to clean (headers or body).
     * @param {string[]} sensitiveFields - The list of sensitive fields to redact.
     * @returns {any} - The cleaned data object.
     */
    redactSensitiveData(data: any, sensitiveFields?: string[]): any;
}
