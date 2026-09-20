import { ISMTPConfig } from '@gauzy/common';
import { ICustomSmtp, ICustomSmtpFindInput, IVerifySMTPTransport } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { CustomSmtp } from './custom-smtp.entity';
import { TypeOrmCustomSmtpRepository } from './repository/type-orm-custom-smtp.repository';
import { MikroOrmCustomSmtpRepository } from './repository/mikro-orm-custom-smtp.repository';
export declare class CustomSmtpService extends TenantAwareCrudService<CustomSmtp> {
    readonly typeOrmCustomSmtpRepository: TypeOrmCustomSmtpRepository;
    readonly mikroOrmCustomSmtpRepository: MikroOrmCustomSmtpRepository;
    constructor(typeOrmCustomSmtpRepository: TypeOrmCustomSmtpRepository, mikroOrmCustomSmtpRepository: MikroOrmCustomSmtpRepository);
    /**
     * Retrieves SMTP settings for a given tenant/organization.
     *
     * @param {ICustomSmtpFindInput} query - The query parameters containing organizationId.
     * @returns {Promise<ICustomSmtp | ISMTPConfig>} - The SMTP settings or default settings if an error occurs.
     */
    getSmtpSetting(query: ICustomSmtpFindInput): Promise<ICustomSmtp | ISMTPConfig>;
    /**
     * Verifies SMTP configuration
     *
     * @param configuration
     * @returns
     */
    verifyTransporter(transport: IVerifySMTPTransport): Promise<boolean>;
}
