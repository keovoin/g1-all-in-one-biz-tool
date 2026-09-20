/**
 * Express `trust proxy` value used when `TRUST_PROXY` is unset.
 *
 * One hop: the immediate peer (the reverse proxy / ingress that terminates the connection) is
 * trusted, every address it forwarded is not. That is enough for `req.protocol` — and therefore
 * `cookie: { secure: 'auto' }` in `redis-store.ts` — to keep working behind any proxy, because
 * Express only requires the IMMEDIATE peer to be trusted before reading `X-Forwarded-Proto`. It is
 * NOT enough for a client to inject its own `X-Forwarded-For` entry and become `req.ip`, which the
 * previous unconditional `true` allowed (GHSA-86mw-2crg-vmhc).
 */
export declare const DEFAULT_TRUST_PROXY = 1;
/**
 * Parsed form of the `TRUST_PROXY` environment variable, in the shapes Express accepts.
 */
export type TrustProxySetting = boolean | number | string[];
/**
 * Resolves the Express `trust proxy` setting from its environment value.
 *
 * Accepted forms (all of which Express understands):
 * - unset / blank → {@link DEFAULT_TRUST_PROXY}
 * - `true` / `false` → trust every proxy / trust none
 * - a non-negative integer → number of hops closest to the app that may be trusted
 * - anything else → comma-separated list of addresses, CIDR ranges or the named presets
 *   (`loopback`, `linklocal`, `uniquelocal`)
 *
 * `true` is honoured because some topologies genuinely need it, but it is announced loudly: with
 * it, `req.ip` (and therefore the rate-limit bucket and every IP written to a log) is whatever the
 * client put at the head of `X-Forwarded-For`.
 *
 * @param raw - The raw `TRUST_PROXY` value.
 * @returns The value to pass to `app.set('trust proxy', ...)`.
 */
export declare function resolveTrustProxy(raw?: string): TrustProxySetting;
