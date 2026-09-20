import { IAiChatUiPreferences, IUserUiPreferencesUpdateInput, UiPreferenceFeature } from '@gauzy/contracts';
/**
 * Nested validation for the AI chat panel state.
 * Bounds on `width` are generous on purpose — the client clamps to its own
 * MIN/MAX; the API only rejects nonsense.
 */
export declare class AiChatUiPreferencesDTO implements IAiChatUiPreferences {
    readonly expanded?: boolean;
    readonly position?: 'start' | 'end';
    readonly width?: number;
    readonly maximized?: boolean;
    /** Structural compatibility with `UiPreferenceFeature` (a plain JSON object); extra keys pass through. */
    [key: string]: unknown;
}
/**
 * Body of `PUT /user/ui-preferences`.
 *
 * Only `aiChat` is typed here; other feature keys pass through (the endpoint is
 * intentionally NOT whitelisted) and are validated structurally by
 * `sanitizeUiPreferencesPatch` in the service — each must be a plain object or
 * `null`.
 */
export declare class UpdateUserUiPreferencesDTO implements IUserUiPreferencesUpdateInput {
    readonly aiChat?: AiChatUiPreferencesDTO | null;
    /** Any other feature's state object (see `IUserUiPreferences`); `null` removes it. */
    [feature: string]: UiPreferenceFeature | null | undefined;
}
