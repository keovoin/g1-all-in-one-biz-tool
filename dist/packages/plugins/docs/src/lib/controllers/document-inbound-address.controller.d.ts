import { ID, IDocumentInboundAddressSecret, IDocumentInboundDomainVerification } from '@gauzy/contracts';
import { InboundAddressService } from '../capture/inbound-address.service';
import { DocumentInboundAddress } from '../entities/document-inbound-address.entity';
import { CreateDocumentInboundAddressDTO, DocumentInboundAddressQueryDTO, UpdateDocumentInboundAddressDTO } from '../dto/document-inbound-address.dto';
/**
 * Tenant-facing management of inbound email capture addresses.
 *
 * Guarded exactly like every other Documents settings surface — tenant, permission and feature
 * flag — which is what distinguishes it from the `@Public()` webhook that *receives* the mail.
 *
 * Mutating routes require `DOCS_MANAGE` rather than `DOCS_UPDATE`: adding a capture address opens
 * an ingestion channel into the organization, which is an administrative act, not document editing.
 */
export declare class DocumentInboundAddressController {
    private readonly inboundAddressService;
    constructor(inboundAddressService: InboundAddressService);
    /**
     * Lists the organization's capture addresses, minting the platform one on first call.
     *
     * `webhookSecretHash` is stripped from every response — a hash is still a verifier, and this
     * endpoint is readable by anyone with `DOCS_READ`.
     */
    list(query: DocumentInboundAddressQueryDTO): Promise<Partial<DocumentInboundAddress>[]>;
    /**
     * Registers a capture address on a domain the organization owns.
     *
     * The response carries the relay secret in plaintext — the only time it is ever returned.
     */
    create(input: CreateDocumentInboundAddressDTO): Promise<{
        address: Partial<DocumentInboundAddress>;
        secret: IDocumentInboundAddressSecret;
        verification: IDocumentInboundDomainVerification;
    }>;
    /**
     * The DNS record to publish, and where verification currently stands.
     */
    verification(id: ID, query: DocumentInboundAddressQueryDTO): Promise<IDocumentInboundDomainVerification>;
    /**
     * Performs the DNS lookup and arms the address if the record is present.
     */
    verify(id: ID, body: DocumentInboundAddressQueryDTO): Promise<IDocumentInboundDomainVerification>;
    /**
     * Issues a new relay secret, invalidating the previous one. Returned in plaintext once.
     */
    rotateSecret(id: ID, body: DocumentInboundAddressQueryDTO): Promise<IDocumentInboundAddressSecret>;
    /**
     * Mints a new token for a platform address — i.e. a new address. Use when the current one
     * has leaked and started collecting junk.
     */
    rotateAddress(id: ID, body: DocumentInboundAddressQueryDTO): Promise<Partial<DocumentInboundAddress>>;
    /**
     * Updates the sender allowlist, body-import preference, or active flag.
     */
    update(id: ID, input: UpdateDocumentInboundAddressDTO): Promise<Partial<DocumentInboundAddress>>;
    /**
     * Resolves the effective scope, preferring an explicit organization over the request context.
     */
    private scope;
    /**
     * Response projection. Drops `webhookSecretHash` — never expose a verifier, even hashed.
     */
    private toResponse;
}
