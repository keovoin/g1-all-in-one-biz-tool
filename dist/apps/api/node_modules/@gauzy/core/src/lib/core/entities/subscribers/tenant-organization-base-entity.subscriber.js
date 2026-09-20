"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantOrganizationBaseEntityEventSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("./base-entity-event.subscriber");
const tenant_organization_base_entity_1 = require("../tenant-organization-base.entity");
const tenant_base_entity_1 = require("../tenant-base.entity");
/**
 *
 */
let TenantOrganizationBaseEntityEventSubscriber = class TenantOrganizationBaseEntityEventSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Event subscriber to handle pre-creation logic for entities.
     * @param entity - The entity being created.
     * @param em - Optional entity manager, in case additional queries are needed.
     */
    async beforeEntityCreate(entity, em) {
        try {
            if (entity instanceof tenant_base_entity_1.TenantBaseEntity) {
                // Set the tenant based on tenantId if not already set
                if (entity['tenantId'] && !entity['tenant']) {
                    // Directly set the tenant based on tenantId
                    entity['tenant'] = { id: entity['tenantId'] };
                }
                // If entity is also TenantOrganizationBaseEntity, set the organization
                if (entity instanceof tenant_organization_base_entity_1.TenantOrganizationBaseEntity) {
                    // Only proceed if the entity has organizationId and lacks an organization
                    if (entity['organizationId'] && !entity['organization']) {
                        // Directly set the organization based on organizationId
                        entity['organization'] = { id: entity['organizationId'] };
                    }
                }
            }
        }
        catch (error) {
            console.error('TenantOrganizationBaseEntityEventSubscriber: An error occurred during the beforeEntityCreate process:', error.message);
        }
    }
};
exports.TenantOrganizationBaseEntityEventSubscriber = TenantOrganizationBaseEntityEventSubscriber;
exports.TenantOrganizationBaseEntityEventSubscriber = TenantOrganizationBaseEntityEventSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TenantOrganizationBaseEntityEventSubscriber);
//# sourceMappingURL=tenant-organization-base-entity.subscriber.js.map