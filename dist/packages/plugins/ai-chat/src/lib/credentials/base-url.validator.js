"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSafeAiProviderBaseUrl = assertSafeAiProviderBaseUrl;
exports.IsSafeAiProviderBaseUrl = IsSafeAiProviderBaseUrl;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const ssrf_1 = require("../ssrf");
/**
 * Validates a tenant-supplied AI-provider base URL against the SSRF egress guard.
 *
 * Throws a {@link BadRequestException} when the URL targets a loopback / private / link-local host
 * (incl. the cloud-metadata IP `169.254.169.254`), uses a scheme other than http/https, carries
 * embedded credentials, carries a query string or fragment, or is otherwise malformed. Applied both
 * when the credential is STORED and again when it is READ back for a request, so rows written
 * before this guard existed are refused too — the lesson of the Make.com and Zapier SSRF fixes
 * (GHSA-534m-c6mh-mp98, GHSA-6gg6-vv4f-2x74) is that fixing the entry point is not fixing the sink
 * (GHSA-w3mx-m5cr-3gxp).
 *
 * Plain `http:` and private addresses are not refused outright as a matter of policy: self-hosted
 * model servers (LocalAI, Speaches, vLLM, Ollama, whisper.cpp) legitimately run on `localhost` or a
 * LAN. Those deployments opt in with `GAUZY_AI_CHAT_ALLOW_PRIVATE_BASE_URLS=true`; the default is
 * deny, which is what shared hosting needs.
 *
 * @param baseUrl - The provider base URL being stored.
 */
function assertSafeAiProviderBaseUrl(baseUrl) {
    const reason = (0, ssrf_1.getUnsafeAiProviderBaseUrlReason)(baseUrl);
    if (reason) {
        throw new common_1.BadRequestException(`Invalid base URL: ${reason}.`);
    }
}
/**
 * class-validator form of {@link assertSafeAiProviderBaseUrl}, so the rejection surfaces at the
 * validation pipe with the same message shape the settings form already renders. The service check
 * remains the authority — this only moves the 400 earlier.
 */
function IsSafeAiProviderBaseUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSafeAiProviderBaseUrl',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    // `null`/`undefined` means "clear" or "not supplied" — `@IsOptional` owns that case. An
                    // empty string is NOT that: it is refused here exactly as the service refuses it.
                    if (value === null || value === undefined)
                        return true;
                    return typeof value === 'string' && (0, ssrf_1.getUnsafeAiProviderBaseUrlReason)(value) === null;
                },
                defaultMessage(args) {
                    const reason = typeof args.value === 'string'
                        ? (0, ssrf_1.getUnsafeAiProviderBaseUrlReason)(args.value)
                        : 'it is not a valid URL';
                    return `Invalid base URL: ${reason}.`;
                }
            }
        });
    };
}
//# sourceMappingURL=base-url.validator.js.map