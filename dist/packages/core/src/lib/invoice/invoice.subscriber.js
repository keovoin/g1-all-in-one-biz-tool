"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@gauzy/config");
const invoice_entity_1 = require("./invoice.entity");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const utils_1 = require("../core/utils");
const entity_event_subscriber_types_1 = require("../core/entities/subscribers/entity-event-subscriber.types");
let InvoiceSubscriber = class InvoiceSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Invoice events.
     */
    listenTo() {
        return invoice_entity_1.Invoice;
    }
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    isValidEntityManager(em, ormType) {
        if (!em)
            return false;
        switch (ormType) {
            case utils_1.MultiORMEnum.TypeORM:
                return em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager;
            case utils_1.MultiORMEnum.MikroORM:
                return em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager;
            default:
                return false;
        }
    }
    /**
     * Updates the invoice entity with the generated token based on the ORM type.
     *
     * @param em The entity manager (TypeORM or MikroORM)
     * @param entityId The invoice entity ID
     * @param token The generated token to update
     * @param ormType The ORM type being used
     */
    async updateInvoiceToken(em, entityId, token, ormType) {
        switch (ormType) {
            case utils_1.MultiORMEnum.TypeORM:
                if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
                    await em.update(invoice_entity_1.Invoice, { id: entityId }, { token });
                }
                break;
            case utils_1.MultiORMEnum.MikroORM:
                if (em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager) {
                    await em.nativeUpdate(invoice_entity_1.Invoice, { id: entityId }, { token });
                }
                break;
            default:
                console.warn(`InvoiceSubscriber: Unsupported ORM type: ${ormType}`);
                break;
        }
    }
    /**
     * Called after an Invoice entity is created in the database. This method updates
     * the entity by setting a generated token for public access.
     *
     * @param entity The newly created Invoice entity.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the update operation is complete.
     */
    async afterEntityCreate(entity, em) {
        try {
            if (!(entity instanceof invoice_entity_1.Invoice)) {
                return; // Early exit if the entity is not an Invoice
            }
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_1.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                console.warn('InvoiceSubscriber: Entity manager is not available or type mismatch.');
                return;
            }
            // Generate token with invoice payload
            const token = this.createToken({
                id: entity.id,
                organizationId: entity.organizationId,
                tenantId: entity.tenantId
            });
            // Update the Invoice entity with the generated token
            await this.updateInvoiceToken(em, entity.id, token, ormType);
        }
        catch (error) {
            console.error('InvoiceSubscriber: Error during the afterEntityCreate process:', error);
        }
    }
    /**
     * Generates a JWT token for public invoice access.
     *
     * @param payload The invoice data to be encoded in the JWT.
     * @returns The generated JWT string.
     */
    createToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_SECRET, {});
    }
};
exports.InvoiceSubscriber = InvoiceSubscriber;
exports.InvoiceSubscriber = InvoiceSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], InvoiceSubscriber);
//# sourceMappingURL=invoice.subscriber.js.map