import { FindOptionsWhere } from 'typeorm';
import { ID, IEstimateEmail } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EstimateEmail } from './estimate-email.entity';
import { TypeOrmEstimateEmailRepository } from './repository/type-orm-estimate-email.repository';
import { MikroOrmEstimateEmailRepository } from './repository/mikro-orm-estimate-email.repository';
import { TypeOrmInvoiceRepository } from './../invoice/repository/type-orm-invoice.repository';
export declare class EstimateEmailService extends TenantAwareCrudService<EstimateEmail> {
    readonly typeOrmEstimateEmailRepository: TypeOrmEstimateEmailRepository;
    readonly mikroOrmEstimateEmailRepository: MikroOrmEstimateEmailRepository;
    private readonly typeOrmInvoiceRepository;
    constructor(typeOrmEstimateEmailRepository: TypeOrmEstimateEmailRepository, mikroOrmEstimateEmailRepository: MikroOrmEstimateEmailRepository, typeOrmInvoiceRepository: TypeOrmInvoiceRepository);
    /**
     * Creates an estimate email entry and generates a JWT token for secure verification.
     *
     * @param {ID} id - The unique identifier of the invoice.
     * @param {string} email - The recipient's email address.
     * @returns {Promise<IEstimateEmail>} - A promise resolving to the created estimate email entry.
     *
     * @throws {HttpException} - Throws an `HttpException` if an error occurs during processing.
     *
     * @description
     * This method retrieves the invoice and its associated organization, determines the token expiration,
     * generates a JWT token, and saves the estimate email details, including the expiration date and security token.
     */
    createEstimateEmail(id: ID, email: string): Promise<IEstimateEmail>;
    /**
     * Validate estimate email
     *
     * @param params
     * @param relations
     * @returns
     */
    validate(params: FindOptionsWhere<EstimateEmail>, relations?: string[]): Promise<IEstimateEmail>;
}
