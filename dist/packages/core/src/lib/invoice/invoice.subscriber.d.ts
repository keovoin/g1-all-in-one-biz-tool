import { Invoice } from './invoice.entity';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
export declare class InvoiceSubscriber extends BaseEntityEventSubscriber<Invoice> {
    /**
     * Indicates that this subscriber only listen to Invoice events.
     */
    listenTo(): typeof Invoice;
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    private isValidEntityManager;
    /**
     * Updates the invoice entity with the generated token based on the ORM type.
     *
     * @param em The entity manager (TypeORM or MikroORM)
     * @param entityId The invoice entity ID
     * @param token The generated token to update
     * @param ormType The ORM type being used
     */
    private updateInvoiceToken;
    /**
     * Called after an Invoice entity is created in the database. This method updates
     * the entity by setting a generated token for public access.
     *
     * @param entity The newly created Invoice entity.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the update operation is complete.
     */
    afterEntityCreate(entity: Invoice, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Generates a JWT token for public invoice access.
     *
     * @param payload The invoice data to be encoded in the JWT.
     * @returns The generated JWT string.
     */
    private createToken;
}
