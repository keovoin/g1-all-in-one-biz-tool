"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("../core/utils");
const crud_service_1 = require("../core/crud/crud.service");
const commands_1 = require("./commands");
const commands_2 = require("../role/commands");
const commands_3 = require("./../tasks/statuses/commands");
const import_record_1 = require("./../export-import/import-record");
const commands_4 = require("./tenant-setting/commands");
const commands_5 = require("./../tasks/sizes/commands");
const commands_6 = require("./../tasks/priorities/commands");
const commands_7 = require("./../tasks/issue-type/commands");
const type_orm_role_repository_1 = require("../role/repository/type-orm-role.repository");
const mikro_orm_role_repository_1 = require("../role/repository/mikro-orm-role.repository");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const mikro_orm_user_repository_1 = require("../user/repository/mikro-orm-user.repository");
const type_orm_tenant_repository_1 = require("./repository/type-orm-tenant.repository");
const mikro_orm_tenant_repository_1 = require("./repository/mikro-orm-tenant.repository");
const stripe_subscription_service_1 = require("../shared/billing/stripe-subscription.service");
let TenantService = class TenantService extends crud_service_1.CrudService {
    constructor(typeOrmTenantRepository, mikroOrmTenantRepository, typeOrmRoleRepository, mikroOrmRoleRepository, typeOrmUserRepository, mikroOrmUserRepository, commandBus, configService, stripeSubscriptionService) {
        super(typeOrmTenantRepository, mikroOrmTenantRepository);
        this.typeOrmTenantRepository = typeOrmTenantRepository;
        this.mikroOrmTenantRepository = mikroOrmTenantRepository;
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.mikroOrmUserRepository = mikroOrmUserRepository;
        this.commandBus = commandBus;
        this.configService = configService;
        this.stripeSubscriptionService = stripeSubscriptionService;
    }
    /**
     * Onboard a tenant and assigns roles to a user. This involves tenant creation,
     * executing update tasks, assigning the SUPER_ADMIN role, and handling import records.
     *
     * @param entity Tenant creation details.
     * @param user User to be associated with the tenant.
     * @returns The created ITenant entity.
     */
    async onboardTenant(entity, user) {
        console.time('On Boarding Tenant');
        // Creates and saves a tenant entity from the given details.
        const tenant = await this.create(entity);
        // Record which Stripe customer this tenant bills through, if that is already safe to determine.
        // Usually it is not at this point — the link needs a confirmed email address and the buyer has
        // only just been sent the confirmation — so this commonly does nothing and the link is made on
        // their first visit to the billing page instead. See linkStripeCustomer() for why.
        await this.linkStripeCustomer(tenant, user);
        // Create Role/Permissions to relative tenants.
        await this.commandBus.execute(new commands_2.TenantRoleBulkCreateCommand([tenant]));
        // Executes Runs update tasks for the newly created tenant.
        this.executeTenantUpdateTasks(tenant);
        // Store the unique identifier of the tenant for easy access in subsequent operations.
        const tenantId = tenant.id;
        // Find SUPER_ADMIN role for the relative tenant.
        let role;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM:
                role = await this.mikroOrmRoleRepository.findOne({
                    tenantId,
                    name: contracts_1.RolesEnum.SUPER_ADMIN
                });
                break;
            case utils_1.MultiORMEnum.TypeORM:
            default:
                role = await this.typeOrmRoleRepository.findOneBy({
                    tenantId,
                    name: contracts_1.RolesEnum.SUPER_ADMIN
                });
                break;
        }
        // Update the user entity to assign the specified tenant and role.
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM:
                await this.mikroOrmUserRepository.nativeUpdate({ id: user.id }, { tenant: tenantId, role: role.id });
                break;
            case utils_1.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmUserRepository.update(user.id, {
                    tenant: { id: tenantId },
                    role: { id: role.id }
                });
                break;
        }
        // Create Import Records while migrating for relative tenant.
        await this.importRecords(entity, tenant, user);
        console.timeEnd('On Boarding Tenant');
        return tenant;
    }
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
    async linkStripeCustomer(tenant, user) {
        if (!this.stripeSubscriptionService.isBillingEnforced())
            return null;
        if (!user?.email || !tenant?.id)
            return null;
        // An address is only evidence of who someone is once they have proved they receive mail at it,
        // and until then this link must not be made.
        //
        // The attack it prevents: email is NOT unique in this platform — `login()` deliberately loads
        // every user with a given address and tries the password against each, to support one person
        // holding accounts in several tenants. So an attacker who knows that alice@corp.com has paid
        // can register a second account under that same address, satisfy the registration paywall with
        // Alice's subscription, create their own tenant, and — without this check — have Alice's Stripe
        // customer written onto it. From there every /billing route resolves to Alice's account: her
        // invoices and card details are readable, her plan can be changed (charging her card a
        // proration immediately), her subscription can be cancelled, and a full Stripe customer-portal
        // session can be opened against it. Nothing in Alice's own product would show that it happened.
        //
        // Verification is the cheap and decisive answer, because the one thing the attacker cannot do
        // is read Alice's mail. A genuine buyer is simply linked slightly later — see
        // `ensureStripeCustomerLink`, which completes the link on their first visit to the billing page
        // once they have confirmed the address.
        if (!user.emailVerifiedAt) {
            return null;
        }
        const stripeCustomerId = await this.stripeSubscriptionService.findCustomerIdForEmail(user.email);
        if (!stripeCustomerId)
            return null;
        // Second line of defense, independent of the first: never adopt a customer that some other
        // tenant already bills through. Two tenants pointing at one Stripe customer is never something
        // we want, however it came about.
        const claimedBy = await this.typeOrmTenantRepository.findOne({
            where: { stripeCustomerId },
            select: { id: true }
        });
        if (claimedBy && claimedBy.id !== tenant.id) {
            console.warn(`Refusing to link tenant ${tenant.id} to a Stripe customer already held by tenant ${claimedBy.id}.`);
            return null;
        }
        // Through CrudService rather than the TypeORM repository directly: this class is multi-ORM, and
        // writing straight to typeOrmTenantRepository would silently do nothing on a deployment running
        // DB_ORM=mikro-orm, leaving the tenant unlinked with no error to notice.
        await this.update(tenant.id, { stripeCustomerId });
        tenant.stripeCustomerId = stripeCustomerId;
        return stripeCustomerId;
    }
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
    async ensureStripeCustomerLink(tenantId, userId) {
        if (!this.stripeSubscriptionService.isBillingEnforced())
            return null;
        if (!tenantId || !userId)
            return null;
        try {
            const [tenant, user] = await Promise.all([
                this.typeOrmTenantRepository.findOne({
                    where: { id: tenantId },
                    select: { id: true, stripeCustomerId: true }
                }),
                this.typeOrmUserRepository.findOne({
                    where: { id: userId },
                    select: { id: true, email: true, emailVerifiedAt: true, tenantId: true }
                })
            ]);
            if (!tenant || !user)
                return null;
            if (tenant.stripeCustomerId?.trim())
                return tenant.stripeCustomerId.trim();
            // The caller must belong to the tenant being linked. RequestContext already scopes the
            // request, but this method takes both ids, so it verifies rather than assumes.
            if (user.tenantId !== tenantId)
                return null;
            return await this.linkStripeCustomer(tenant, user);
        }
        catch (error) {
            console.warn('Could not resolve a Stripe customer for this tenant:', error?.message);
            return null;
        }
    }
    /**
     * Executes a set of update tasks for a given tenant in parallel.
     *
     * @param tenant An instance of the Tenant class.
     * @returns Promise<void>
     */
    async executeTenantUpdateTasks(tenant) {
        try {
            await Promise.all([
                // 1. Create Enabled/Disabled features for relative tenants.
                this.commandBus.execute(new commands_1.TenantFeatureOrganizationCreateCommand([tenant])),
                // 2. Create Default task statuses for relative tenants.
                this.commandBus.execute(new commands_3.TenantStatusBulkCreateCommand([tenant])),
                // 3. Create default task sizes for relative tenants.
                this.commandBus.execute(new commands_5.TenantTaskSizeBulkCreateCommand([tenant])),
                // 4. Create default task priorities for relative tenants.
                this.commandBus.execute(new commands_6.TenantTaskPriorityBulkCreateCommand([tenant])),
                // 5. Create default issue types for relative tenants.
                this.commandBus.execute(new commands_7.TenantIssueTypeBulkCreateCommand([tenant]))
            ]);
            // 6. Initialize default settings for the new tenant, including file storage provider.
            await this.initializeTenantSettings(tenant);
        }
        catch (error) {
            console.log(error, 'Error occurred while executing tenant create tasks:', error.message);
        }
    }
    /**
     * Initializes settings for a new tenant, particularly setting up the file storage provider.
     * It retrieves the file system configuration and defaults to LOCAL storage if no specific
     * setting is found. Then, it executes a TenantSettingSaveCommand to save these settings for the tenant.
     *
     * @param tenant The tenant entity for which settings are being initialized.
     */
    async initializeTenantSettings(tenant) {
        const fileSystem = this.configService.get('fileSystem');
        const fileStorageProvider = fileSystem.name.toUpperCase();
        await this.commandBus.execute(new commands_4.TenantSettingSaveCommand({ fileStorageProvider }, tenant.id));
    }
    /**
     * Handles the creation of import records for a tenant and associated user based on migration data.
     * It checks the tenant creation input for import requirements and processes accordingly.
     *
     * @param entity Details about the tenant import.
     * @param tenant The tenant entity.
     * @param user The associated user entity.
     */
    async importRecords(entity, tenant, user) {
        const { isImporting = false, sourceId = null, userSourceId = null } = entity;
        const { id: tenantId } = tenant;
        if (isImporting && sourceId) {
            // Executes a command to either update an existing import record or create a new one for the tenant entity.
            await this.commandBus.execute(new import_record_1.ImportRecordUpdateOrCreateCommand({
                entityType: this.typeOrmTenantRepository?.metadata?.tableName ?? 'tenant',
                sourceId,
                destinationId: tenantId,
                tenantId
            }));
            // If a user source ID is provided, execute a command to update or create an import record for the user entity.
            if (userSourceId) {
                await this.commandBus.execute(new import_record_1.ImportRecordUpdateOrCreateCommand({
                    entityType: this.typeOrmUserRepository?.metadata?.tableName ?? 'user',
                    sourceId: userSourceId,
                    destinationId: user.id
                }, {
                    tenantId
                }));
            }
        }
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_tenant_repository_1.TypeOrmTenantRepository,
        mikro_orm_tenant_repository_1.MikroOrmTenantRepository,
        type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository,
        type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository,
        cqrs_1.CommandBus,
        config_1.ConfigService,
        stripe_subscription_service_1.StripeSubscriptionService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map