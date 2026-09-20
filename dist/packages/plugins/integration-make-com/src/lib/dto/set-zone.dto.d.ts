import { MakeComZone } from '../interfaces/make-com-api.model';
/**
 * DTO for the "set zone" endpoint.
 *
 * The zone is string-interpolated into the Make.com API hostname (`https://${zone}.make.com/...`),
 * so it MUST be constrained to the known allowlist at runtime — `@IsIn(MAKE_COM_ZONES)` — to prevent
 * host-injection SSRF (GHSA-vcwx-qh95-54g6). The compile-time `MakeComZone` union is erased at
 * runtime and is not sufficient on its own.
 */
export declare class SetZoneDTO {
    zone: MakeComZone;
    organizationId?: string;
}
