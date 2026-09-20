"use strict";
var InboundAddressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundAddressService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:dns/promises");
const contracts_1 = require("@gauzy/contracts");
const document_inbound_address_entity_1 = require("../entities/document-inbound-address.entity");
const inbound_address_util_1 = require("./inbound-address.util");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
/**
 * Owns the lifecycle of an organization's inbound capture address — minting, resolving, verifying
 * and rotating it.
 *
 * ## Why this exists
 *
 * The capture channel shipped with a resolver but no provisioner: `inbound-email.service.ts` read a
 * `tenant_setting` row named `docs.<organizationId>.inboundToken` that **nothing in the codebase
 * ever wrote**. Every real delivery therefore 404'd at the unknown-recipient gate; the feature only
 * appeared to work in a unit test that stubbed the lookup. This service is the missing half.
 *
 * ## Two kinds of address
 *
 * - **PLATFORM** — zero-config. Minted on first read for any organization, on the deployment-wide
 *   `GAUZY_DOCS_INBOUND_DOMAIN`, distinguished by 128 bits of CSPRNG entropy:
 *   `docs-<token>@<platform domain>`. The address itself is the credential, so it is unguessable
 *   by construction.
 * - **CUSTOM_DOMAIN** — the organization publishes its own domain. The local part is theirs to
 *   choose (`docs@acme.com`), which makes the address guessable, so it is inert until a DNS TXT
 *   record proves they control the domain.
 *
 * ## The per-address secret
 *
 * Each address carries its own relay secret, stored only as SHA-256. A single deployment-wide
 * `GAUZY_DOCS_INBOUND_WEBHOOK_SECRET` means one leak lets an attacker post mail *as any tenant*;
 * a per-address secret contains that blast radius to one organization. The global secret remains
 * supported so existing relays keep working.
 */
let InboundAddressService = InboundAddressService_1 = class InboundAddressService {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(InboundAddressService_1.name);
    }
    /**
     * Returns the organization's addresses, minting the PLATFORM one on first call.
     *
     * Provisioning on read (rather than at organization-creation time) means every existing
     * organization gets an address the moment someone looks, with no backfill migration over the
     * `organization` table.
     */
    async listForOrganization(tenantId, organizationId) {
        const existing = await this.repository.find({
            where: { tenantId, organizationId },
            order: { createdAt: 'ASC' }
        });
        if (existing.some((row) => row.kind === contracts_1.DocumentInboundAddressKindEnum.PLATFORM)) {
            return existing;
        }
        // No platform address yet. Mint one — unless the deployment has no inbound domain
        // configured, in which case there is no address to mint and we say so honestly rather
        // than fabricating one that could never receive mail.
        if (!(0, docs_config_1.getDocsConfig)().inboundDomain) {
            return existing;
        }
        const minted = await this.mintPlatformAddress(tenantId, organizationId);
        return [minted, ...existing];
    }
    /**
     * Mints the PLATFORM address. Retries once on a unique-index collision, which can only happen
     * if two requests race — the database, not the read-then-write, is what makes this safe.
     */
    async mintPlatformAddress(tenantId, organizationId) {
        const domain = this.requirePlatformDomain();
        for (let attempt = 0; attempt < 3; attempt++) {
            const token = (0, node_crypto_1.randomBytes)(16).toString('hex'); // 128 bits, lower-case hex
            const address = `${docs_constants_1.DOCS_INBOUND_PLATFORM_LOCAL_PREFIX}${token}@${domain}`.toLowerCase();
            try {
                const row = this.repository.create({
                    tenantId,
                    organizationId,
                    kind: contracts_1.DocumentInboundAddressKindEnum.PLATFORM,
                    token,
                    address,
                    // The platform owns this domain; there is nothing for the tenant to prove.
                    domainStatus: contracts_1.DocumentInboundDomainStatusEnum.VERIFIED,
                    domainVerifiedAt: new Date(),
                    isActive: true
                });
                return await this.repository.save(row);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                if (!/unique|duplicate/i.test(message) || attempt === 2) {
                    throw error;
                }
                this.logger.warn(`Inbound address token collision, retrying (attempt ${attempt + 1}).`);
            }
        }
        /* istanbul ignore next — the loop either returns or throws above. */
        throw new common_1.BadRequestException('Could not mint an inbound address.');
    }
    /**
     * Registers a tenant-owned domain. The address is created PENDING and rejects mail until
     * {@link verifyDomain} observes the TXT record.
     *
     * @returns the row plus the one-time plaintext relay secret.
     */
    async createCustomDomain(tenantId, organizationId, input) {
        const domain = this.normalizeDomain(input.domain);
        const localPart = this.normalizeLocalPart(input.localPart);
        const address = `${localPart}@${domain}`;
        // A tenant must not be able to claim the platform's own domain and thereby intercept
        // another organization's platform address.
        const platformDomain = (0, docs_config_1.getDocsConfig)().inboundDomain?.trim().toLowerCase();
        if (platformDomain && (domain === platformDomain || domain.endsWith(`.${platformDomain}`))) {
            throw new common_1.BadRequestException('That domain is reserved by the platform.');
        }
        const clash = await this.repository.findOne({ where: { address } });
        if (clash) {
            throw new common_1.BadRequestException('That address is already registered.');
        }
        const { secret, hash } = this.mintSecret();
        const row = this.repository.create({
            tenantId,
            organizationId,
            kind: contracts_1.DocumentInboundAddressKindEnum.CUSTOM_DOMAIN,
            domain,
            localPart,
            address,
            domainStatus: contracts_1.DocumentInboundDomainStatusEnum.PENDING,
            domainVerificationToken: `gauzy-docs-verify=${(0, node_crypto_1.randomBytes)(16).toString('hex')}`,
            webhookSecretHash: hash,
            senderAllowlistRaw: input.senderAllowlist?.length ? JSON.stringify(input.senderAllowlist) : null,
            importBodyAsNote: input.importBodyAsNote ?? false,
            isActive: true
        });
        const saved = await this.repository.save(row);
        return { row: saved, secret: { address: saved.address, webhookSecret: secret } };
    }
    /**
     * The DNS record the organization must publish, plus current status.
     */
    describeVerification(row) {
        return {
            recordType: 'TXT',
            recordName: `${docs_constants_1.DOCS_INBOUND_DOMAIN_TXT_PREFIX}.${row.domain}`,
            recordValue: row.domainVerificationToken ?? '',
            status: row.domainStatus,
            verifiedAt: row.domainVerifiedAt ?? null,
            lastCheckedAt: row.domainLastCheckedAt ?? null
        };
    }
    /**
     * Looks up `_gauzy-docs.<domain>` IN TXT and arms the address if the expected value is present.
     *
     * Re-checking a VERIFIED domain that has lost its record moves it to FAILED, so a domain that is
     * transferred away stops accepting mail rather than remaining armed forever.
     */
    async verifyDomain(tenantId, organizationId, id) {
        const row = await this.findOneOrFail(tenantId, organizationId, id);
        if (row.kind !== contracts_1.DocumentInboundAddressKindEnum.CUSTOM_DOMAIN) {
            throw new common_1.BadRequestException('Only a custom domain requires verification.');
        }
        const recordName = `${docs_constants_1.DOCS_INBOUND_DOMAIN_TXT_PREFIX}.${row.domain}`;
        let observed = [];
        let message;
        try {
            observed = (await this.resolveTxtWithTimeout(recordName)).map((entry) => entry.trim());
        }
        catch (error) {
            // NXDOMAIN and a timeout are both "not proven yet" — never a 500. The tenant sees why.
            message = error instanceof Error ? error.message : String(error);
        }
        const expected = row.domainVerificationToken ?? '';
        const matched = Boolean(expected) && observed.some((value) => value === expected);
        row.domainLastCheckedAt = new Date();
        if (matched) {
            row.domainStatus = contracts_1.DocumentInboundDomainStatusEnum.VERIFIED;
            row.domainVerifiedAt = row.domainVerifiedAt ?? new Date();
        }
        else {
            // PENDING stays PENDING (never proven); VERIFIED degrades to FAILED (proof withdrawn).
            row.domainStatus =
                row.domainStatus === contracts_1.DocumentInboundDomainStatusEnum.VERIFIED
                    ? contracts_1.DocumentInboundDomainStatusEnum.FAILED
                    : contracts_1.DocumentInboundDomainStatusEnum.PENDING;
            message = message ?? 'The expected TXT record was not found.';
        }
        await this.repository.save(row);
        return { ...this.describeVerification(row), message };
    }
    /**
     * Issues a fresh relay secret, invalidating the previous one. Returned in plaintext exactly once.
     */
    async rotateSecret(tenantId, organizationId, id) {
        const row = await this.findOneOrFail(tenantId, organizationId, id);
        const { secret, hash } = this.mintSecret();
        row.webhookSecretHash = hash;
        await this.repository.save(row);
        return { address: row.address, webhookSecret: secret };
    }
    /**
     * Rotates a PLATFORM address itself (new token ⇒ new address), for when an address leaks and
     * starts receiving junk. The old address stops resolving immediately.
     */
    async rotateAddress(tenantId, organizationId, id) {
        const row = await this.findOneOrFail(tenantId, organizationId, id);
        if (row.kind !== contracts_1.DocumentInboundAddressKindEnum.PLATFORM) {
            throw new common_1.BadRequestException('Only a platform address is rotated by changing its token.');
        }
        const domain = this.requirePlatformDomain();
        const token = (0, node_crypto_1.randomBytes)(16).toString('hex');
        row.token = token;
        row.address = `${docs_constants_1.DOCS_INBOUND_PLATFORM_LOCAL_PREFIX}${token}@${domain}`.toLowerCase();
        return this.repository.save(row);
    }
    async update(tenantId, organizationId, id, input) {
        const row = await this.findOneOrFail(tenantId, organizationId, id);
        if (input.senderAllowlist !== undefined) {
            row.senderAllowlistRaw = input.senderAllowlist.length ? JSON.stringify(input.senderAllowlist) : null;
        }
        if (input.importBodyAsNote !== undefined) {
            row.importBodyAsNote = input.importBodyAsNote;
        }
        if (input.isActive !== undefined) {
            row.isActive = input.isActive;
        }
        return this.repository.save(row);
    }
    /**
     * Resolves a recipient address to its owning scope — the hot path, run on every delivery.
     *
     * Replaces the previous untenanted `LIKE 'docs.%.inboundToken'` scan of `tenant_setting` with a
     * single lookup on a unique index. Deliberately matches on the **whole address**, not just the
     * local part: the old parser discarded the domain entirely, so `docs-<token>@anything-at-all`
     * resolved just as well as the real domain.
     *
     * Returns `null` for anything not armed — unknown, inactive, or an unverified custom domain —
     * so the caller answers with the same 404 it gives an unknown route.
     */
    async resolveByAddress(recipient) {
        const address = this.normalizeRecipient(recipient);
        if (!address) {
            return null;
        }
        const row = await this.repository.findOne({ where: { address } });
        if (!row || row.isActive === false) {
            return null;
        }
        if (row.domainStatus !== contracts_1.DocumentInboundDomainStatusEnum.VERIFIED) {
            this.logger.warn(`Inbound delivery to an unverified address was rejected: ${address}`);
            return null;
        }
        return row;
    }
    /**
     * Constant-time check of a presented relay secret against the address's stored hash.
     *
     * @returns `false` when the address has no per-address secret — the caller then falls back to
     * the deployment-wide secret, so this returning `false` is "not proven here", not "rejected".
     */
    verifySecret(row, presented) {
        if (!row.webhookSecretHash || !presented) {
            return false;
        }
        const expected = Buffer.from(row.webhookSecretHash, 'utf8');
        const actual = Buffer.from((0, node_crypto_1.createHash)('sha256').update(presented).digest('hex'), 'utf8');
        // Length check first — timingSafeEqual throws on a length mismatch.
        if (expected.length !== actual.length) {
            return false;
        }
        return (0, node_crypto_1.timingSafeEqual)(expected, actual);
    }
    /**
     * Is this sender permitted for this address? An empty/absent allowlist means "any sender that
     * passed the SPF/DKIM gate". Matches a bare address (`ceo@acme.com`) or a whole domain
     * (`@acme.com` / `acme.com`).
     */
    isSenderAllowed(row, sender) {
        return (0, inbound_address_util_1.isSenderAllowedBy)(row.senderAllowlist, sender);
    }
    /**
     * Records a successful delivery. Best-effort — a counter must never fail an accepted message.
     */
    async recordDelivery(row) {
        try {
            await this.repository.update(row.id, {
                lastMessageAt: new Date(),
                messageCount: (row.messageCount ?? 0) + 1
            });
        }
        catch (error) {
            this.logger.warn(`Could not record inbound delivery stats: ${error}`);
        }
    }
    async findOneOrFail(tenantId, organizationId, id) {
        // Scoped by tenant AND organization so an id from another tenant is a 404, not a leak.
        const row = await this.repository.findOne({ where: { id, tenantId, organizationId } });
        if (!row) {
            throw new common_1.NotFoundException('Inbound address not found.');
        }
        return row;
    }
    mintSecret() {
        const secret = (0, node_crypto_1.randomBytes)(32).toString('hex');
        return { secret, hash: (0, node_crypto_1.createHash)('sha256').update(secret).digest('hex') };
    }
    requirePlatformDomain() {
        const domain = (0, docs_config_1.getDocsConfig)().inboundDomain?.trim().toLowerCase();
        if (!domain) {
            throw new common_1.BadRequestException('No platform inbound domain is configured (GAUZY_DOCS_INBOUND_DOMAIN).');
        }
        return domain;
    }
    normalizeDomain(value) {
        const domain = (0, inbound_address_util_1.normalizeInboundDomain)(value);
        if (!domain) {
            throw new common_1.BadRequestException('That is not a valid domain.');
        }
        return domain;
    }
    normalizeLocalPart(value) {
        const localPart = (0, inbound_address_util_1.normalizeInboundLocalPart)(value);
        if (!localPart) {
            throw new common_1.BadRequestException('That is not a valid mailbox name.');
        }
        return localPart;
    }
    /**
     * Lower-cases the address and strips any `+tag` suffix, so `docs+invoices@acme.com` resolves to
     * `docs@acme.com` — senders routinely add tags and each one must not look like a new address.
     */
    normalizeRecipient(recipient) {
        return (0, inbound_address_util_1.normalizeRecipientAddress)(recipient);
    }
    async resolveTxtWithTimeout(name) {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DNS lookup timed out.')), docs_constants_1.DOCS_INBOUND_DNS_TIMEOUT_MS).unref?.());
        const records = await Promise.race([(0, promises_1.resolveTxt)(name), timeout]);
        // resolveTxt returns chunked strings per record; a long TXT value arrives split.
        return records.map((chunks) => chunks.join(''));
    }
};
exports.InboundAddressService = InboundAddressService;
exports.InboundAddressService = InboundAddressService = InboundAddressService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_inbound_address_entity_1.DocumentInboundAddress)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], InboundAddressService);
//# sourceMappingURL=inbound-address.service.js.map