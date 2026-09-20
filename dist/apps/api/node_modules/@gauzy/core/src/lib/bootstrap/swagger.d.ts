import { INestApplication } from '@nestjs/common';
/**
 * Sets up and configures Swagger and Scalar API documentation for the given NestJS application.
 *
 * This function creates a Swagger configuration using the DocumentBuilder by setting the title,
 * description, version, and enabling bearer authentication. It then generates the Swagger document
 * with any additional options and sets up both Swagger UI and Scalar UI at their respective endpoints.
 *
 * @param {INestApplication} app - The NestJS application instance.
 * @returns {Promise<string>} A promise that resolves to the Swagger documentation path.
 */
export declare const setupSwagger: (app: INestApplication, { title, description, version, swaggerPath, scalarPath, enableScalar, contact, license, externalDocs, servers }?: {
    title?: string;
    description?: string;
    version?: string;
    swaggerPath?: string;
    scalarPath?: string;
    enableScalar?: boolean;
    contact?: {
        name?: string;
        url?: string;
        email?: string;
    };
    license?: {
        name?: string;
        url?: string;
    };
    externalDocs?: {
        description?: string;
        url?: string;
    };
    servers?: Array<{
        url: string;
        description: string;
    }>;
}) => Promise<string>;
