import { ValidationOptions } from 'class-validator';
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
export declare function assertSafeAiProviderBaseUrl(baseUrl: string): void;
/**
 * class-validator form of {@link assertSafeAiProviderBaseUrl}, so the rejection surfaces at the
 * validation pipe with the same message shape the settings form already renders. The service check
 * remains the authority — this only moves the 400 earlier.
 */
export declare function IsSafeAiProviderBaseUrl(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
