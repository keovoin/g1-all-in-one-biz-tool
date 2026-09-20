/**
 * Standalone home for {@link LoginAttemptService}.
 *
 * Kept out of `AuthModule` so that modules which verify a credential of their own — the team
 * join-request code, for instance — can use the counter without importing the whole auth graph and
 * closing a require cycle. Its only dependency is the optional, globally registered `EVER_REDIS_CLIENT`.
 */
export declare class LoginAttemptModule {
}
