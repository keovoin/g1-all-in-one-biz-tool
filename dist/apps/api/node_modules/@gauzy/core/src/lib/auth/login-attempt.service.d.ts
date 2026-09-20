import { createClient } from 'redis';
type RedisClient = ReturnType<typeof createClient>;
/**
 * The credential family a failure belongs to. Counters are kept per scope so that, for example,
 * fumbling a team join code never locks a user out of password login.
 */
export declare enum LoginAttemptScope {
    PASSWORD = "password",
    MAGIC_CODE = "magic-code",
    TEAM_JOIN_CODE = "team-join-code"
}
/**
 * Distinct client sources a failure streak must span before it becomes a hard block.
 *
 * The block is keyed on the ACCOUNT, and anyone who knows an email address can submit wrong
 * passwords for it. If failures from a single source were enough, one client could keep any known
 * account locked out of login indefinitely. A single source is already bounded by the per-address
 * route throttle, so the per-account block only has to engage once the guesses demonstrably come
 * from more than one place — which is the distributed attack it exists for.
 */
export declare const LOGIN_ATTEMPT_MIN_SOURCES = 2;
/**
 * How long an unfinished attempt holds its concurrency slot before it is presumed abandoned.
 *
 * Slots are normally released within milliseconds by {@link LoginAttempt.fail},
 * {@link LoginAttempt.succeed} or {@link LoginAttempt.release}. The expiry only matters for a request
 * that died without doing so, and keeps such a leak from shrinking the account's allowance forever.
 */
export declare const LOGIN_ATTEMPT_RESERVATION_MS = 30000;
/**
 * How long one counter operation may wait on Redis before it is served from the in-process store.
 * Same reasoning as the throttler storage: a disconnected node-redis client parks commands rather
 * than rejecting them, and this sits on the login path.
 */
export declare const LOGIN_ATTEMPT_REDIS_TIMEOUT_MS = 250;
/**
 * Upper bound on accounts tracked by the in-process store, so a spray of distinct emails cannot grow
 * it without limit. The oldest entries are dropped first.
 */
export declare const LOGIN_ATTEMPT_MEMORY_MAX_ENTRIES = 50000;
/**
 * One in-flight credential check, returned by {@link LoginAttemptService.begin}.
 *
 * Exactly one of the three methods should be called when the check is over; later calls are
 * ignored, so a `finally` that releases after a `fail()` is harmless.
 */
export interface LoginAttempt {
    /** The credential was wrong: count it against the account. */
    fail(): Promise<void>;
    /** The credential was right: forget the failure streak that preceded it. */
    succeed(): Promise<void>;
    /** The check ended without a verdict on the credential (e.g. an infrastructure error). */
    release(): Promise<void>;
}
/**
 * Identifier-scoped brute-force control.
 *
 * Rate limiting in this API is otherwise keyed on the client address, which bounds how fast ONE
 * client may guess but does nothing about a client that changes address (or, before
 * GHSA-86mw-2crg-vmhc was fixed, merely changed a header) between attempts. This control is keyed on
 * the account identifier instead.
 *
 * Rules, per (scope, account):
 * - Once `AUTH_MAX_FAILED_ATTEMPTS` consecutive failures have come from at least
 *   {@link LOGIN_ATTEMPT_MIN_SOURCES} distinct client sources, the account is blocked for
 *   `AUTH_LOCKOUT_SECONDS` and every attempt gets a 429 with `Retry-After`. Failures from a single
 *   source never block the account — that source is already limited by the route throttle, and
 *   letting it block the account would let anyone lock a known email out of login.
 * - At most `AUTH_MAX_FAILED_ATTEMPTS` checks may be in flight at once, so a burst cannot push
 *   hundreds of concurrent guesses through before the first failures are counted.
 * - A success clears the streak.
 *
 * Residual, by design: an attacker who controls several addresses can still block a known account
 * for `AUTH_LOCKOUT_SECONDS` at a time. That is the price of bounding distributed guessing; operators
 * who would rather rely on the per-address throttle alone set `AUTH_MAX_FAILED_ATTEMPTS=0`.
 *
 * Counters live in Redis (`EVER_REDIS_CLIENT`) when one is configured, so every replica enforces the
 * same numbers, and in the process otherwise. A Redis error or timeout serves that one operation from
 * the in-process store: the control degrades to per-replica counting instead of either failing open
 * or taking authentication down with Redis.
 *
 * Identifiers and client addresses are hashed before they become keys: both are personal data, and
 * keys turn up in Redis monitoring output.
 */
export declare class LoginAttemptService {
    private readonly redisClient?;
    private readonly logger;
    private readonly memory;
    private readonly redis;
    constructor(redisClient?: RedisClient | null);
    /**
     * Failures at which the block engages, and the concurrency cap. `0` disables the whole mechanism.
     */
    private get maxFailures();
    /**
     * How long a blocked identifier stays blocked, and how long a partial failure streak is
     * remembered, in milliseconds.
     */
    private get lockoutMs();
    /**
     * Builds the key for one (scope, identifier) pair.
     *
     * Case- and whitespace-insensitive, because `Admin@Ever.co ` and `admin@ever.co` reach the same
     * account and must therefore share one counter — otherwise the case of the submitted email is a
     * free bucket-rotation trick of exactly the kind this class exists to prevent.
     *
     * @param scope - The credential family.
     * @param identifier - The account identifier (typically an email address).
     * @returns The key.
     */
    private buildKey;
    /**
     * Identifies the client behind the current request with the same spoof-resistant resolution the
     * route throttler uses (trusted `CF-Connecting-IP`, otherwise Express's `req.ip`).
     *
     * @returns The hashed source, and whether no address could be attributed at all.
     */
    private currentSource;
    /**
     * Starts a credential check for `identifier`, or rejects it with 429.
     *
     * Call this BEFORE any credential verification, and outside any `catch` that rewrites errors
     * into `UnauthorizedException` — the point is that the caller sees 429, not 401. Then settle the
     * returned attempt exactly once.
     *
     * @param scope - The credential family being attempted.
     * @param identifier - The account identifier being attempted.
     * @returns The attempt to settle once the credential has been checked.
     * @throws HttpException 429 (with a `Retry-After` header) while the identifier is blocked, or
     * while it already has the maximum number of checks in flight.
     */
    begin(scope: LoginAttemptScope, identifier: string): Promise<LoginAttempt>;
    /**
     * Throws the 429, setting `Retry-After` on the response the way `ThrottlerGuard` does for its own
     * 429, so a client that honours the standard header backs off for the right time.
     *
     * @param retryAfter - Seconds until the caller may try again.
     * @throws HttpException always.
     */
    private reject;
    /**
     * Runs one store operation against Redis when configured, and against the in-process store when
     * Redis is absent, disconnected, failing or slower than {@link LOGIN_ATTEMPT_REDIS_TIMEOUT_MS}.
     *
     * @param operation - Name used in the log line.
     * @param task - The operation.
     * @returns The operation's result.
     */
    private run;
}
export {};
