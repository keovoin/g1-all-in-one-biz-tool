import { CommandBus } from '@nestjs/cqrs';
import { ITenantCreateInput, ITenant, IUser } from '@gauzy/contracts';
import { ConfigService } from '@gauzy/config';
import { CrudService } from '../core/crud/crud.service';
import { TypeOrmRoleRepository } from '../role/repository/type-orm-role.repository';
import { MikroOrmRoleRepository } from '../role/repository/mikro-orm-role.repository';
import { TypeOrmUserRepository } from '../user/repository/type-orm-user.repository';
import { MikroOrmUserRepository } from '../user/repository/mikro-orm-user.repository';
import { TypeOrmTenantRepository } from './repository/type-orm-tenant.repository';
import { MikroOrmTenantRepository } from './repository/mikro-orm-tenant.repository';
import { Tenant } from './tenant.entity';
import { StripeSubscriptionService } from '../shared/billing/stripe-subscription.service';
export declare class TenantService extends CrudService<Tenant> {
    readonly typeOrmTenantRepository: TypeOrmTenantRepository;
    readonly mikroOrmTenantRepository: MikroOrmTenantRepository;
    readonly typeOrmRoleRepository: TypeOrmRoleRepository;
    readonly mikroOrmRoleRepository: MikroOrmRoleRepository;
    readonly typeOrmUserRepository: TypeOrmUserRepository;
    readonly mikroOrmUserRepository: MikroOrmUserRepository;
    readonly commandBus: CommandBus;
    readonly configService: ConfigService;
    readonly stripeSubscriptionService: StripeSubscriptionService;
    constructor(typeOrmTenantRepository: TypeOrmTenantRepository, mikroOrmTenantRepository: MikroOrmTenantRepository, typeOrmRoleRepository: TypeOrmRoleRepository, mikroOrmRoleRepository: MikroOrmRoleRepository, typeOrmUserRepository: TypeOrmUserRepository, mikroOrmUserRepository: MikroOrmUserRepository, commandBus: CommandBus, configService: ConfigService, stripeSubscriptionService: StripeSubscriptionService);
    /**
     * Onboard a tenant and assigns roles to a user. This involves tenant creation,
     * executing update tasks, assigning the SUPER_ADMIN role, and handling import records.
     *
     * @param entity Tenant creation details.
     * @param user User to be associated with the tenant.
     * @returns The created ITenant entity.
     */
    onboardTenant(entity: ITenantCreateInput, user: IUser): Promise<ITenant>;
    /**
     * Records which Stripe customer a tenant bills through, when that can be established safely.
     *
     * Storing the id — rather than looking the buyer up by email on every call — is what keys later
     * billing on something stable: an address can be changed, and Stripe permits several customers to
     * share one, so an email cannot identify a billing account on its own.
     *
     * Establishing the link at all requires a **verified** address; see the reasoning inline. At
     * onboarding that is usually not yet true, since the confirmation mail has only just gone out, so
     * most genuine buyers are linked slightly later by `ensureStripeCustomerLink()` instead. Returns
     * the customer id when a link now exists, or null.
     *
     * Best-effort by design. On a self-hosted install there is no Stripe key and this returns
     * immediately; if Stripe is unreachable the tenant is still created and simply has no link yet.
     * Onboarding must never fail because a payments provider had a bad minute.
     */
    linkStripeCustomer(tenant: ITenant, user: IUser): Promise<string | null>;
    /**
     * Complete a tenant's Stripe link on demand, for a tenant that has none yet.
     *
     * Onboarding cannot always make the link, because at that moment the buyer has usually not yet
     * confirmed their email — the verification message has only just been sent. Rather than lower the
     * bar there, the link is simply made later: the first time someone opens the billing page after
     * confirming their address, this resolves it.
     *
     * Returns the customer id if a link now exists, or null. Never throws — a tenant with no link is a
     * normal state that the caller reports as "not linked", not an error.
     */
    ensureStripeCustomerLink(tenantId: string, userId: string): Promise<string | null>;
    /**
     * Executes a set of update tasks for a given tenant in parallel.
     *
     * @param tenant An instance of the Tenant class.
     * @returns Promise<void>
     */
    executeTenantUpdateTasks(tenant: Tenant): Promise<void>;
    /**
     * Initializes settings for a new tenant, particularly setting up the file storage provider.
     * It retrieves the file system configuration and defaults to LOCAL storage if no specific
     * setting is found. Then, it executes a TenantSettingSaveCommand to save these settings for the tenant.
     *
     * @param tenant The tenant entity for which settings are being initialized.
     */
    private initializeTenantSettings;
    /**
     * Handles the creation of import records for a tenant and associated user based on migration data.
     * It checks the tenant creation input for import requirements and processes accordingly.
     *
     * @param entity Details about the tenant import.
     * @param tenant The tenant entity.
     * @param user The associated user entity.
     */
    importRecords(entity: ITenantCreateInput, tenant: ITenant, user: IUser): Promise<void>;
}
