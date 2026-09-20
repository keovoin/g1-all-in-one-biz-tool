/**
 * Validates that the authentication/session secrets are not unset or left at their well-known
 * default values.
 *
 * - Always logs a prominent warning when weak secrets are detected (any environment).
 * - Additionally refuses to start in a real production deployment (`NODE_ENV=production` and
 *   `DEMO !== 'true'`), unless the operator explicitly opts out via `ALLOW_INSECURE_JWT_SECRET=true`.
 *
 * The daily-reset demo (`DEMO=true`) and local development are intentionally exempted from the hard
 * failure so they keep working out of the box, while still being warned.
 *
 * @throws Error in production (non-demo) when weak secrets are detected and the override is not set.
 */
export declare function validateApplicationSecrets(): void;
/**
 * Options for {@link validateSeedCredentials}.
 */
export interface SeedCredentialOptions {
    /**
     * Whether this seed also creates the fixture accounts (`DEFAULT_EVER_EMPLOYEES`, created by the
     * `ever` and `all` seed types). Their password is hard-coded and published, and no variable
     * rotates it, so such a seed is refused in production outright.
     */
    readonly createsFixtureAccounts?: boolean;
}
/**
 * Validates that the accounts created by a seed do not use published passwords.
 *
 * Mirrors {@link validateApplicationSecrets} exactly:
 * - always logs a prominent warning when a published password is still in place (any environment);
 * - additionally refuses to seed in a real production deployment (`NODE_ENV=production` or a
 *   production build, and `DEMO !== 'true'`), unless the operator opts out via
 *   `ALLOW_INSECURE_SEED_CREDENTIALS=true`.
 *
 * Exemptions, and why they are safe:
 * - `DEMO=true` — the daily-reset demo is meant to be logged into with the documented credentials;
 * - `IS_ELECTRON` — the desktop Gauzy Server spawns this API locally against a private database,
 *   and the desktop README tells the user to sign in as `admin@ever.co`. Refusing to boot there
 *   would break the desktop product without closing any network-reachable hole.
 *
 * This only runs when a seed is about to run. The boot-time seed runs only against a database with
 * no users, so an existing deployment is never refused by it.
 *
 * Call this BEFORE the seeder touches the database: `runDefaultSeed()` truncates every table before
 * it inserts, so an abort has to happen first to be harmless.
 *
 * @param options - What the seed about to run creates.
 * @throws Error in production (non-demo, non-Electron) when a published seed password is detected.
 */
export declare function validateSeedCredentials(options?: SeedCredentialOptions): void;
