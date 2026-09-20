export interface ICurrentUserProvider {
    getCurrentUserId(): string | null;
}
export declare const CURRENT_USER_PROVIDER: symbol & {
    readonly __token?: "CurrentUserProviderToken";
};
export declare class RequestContextCurrentUserProvider implements ICurrentUserProvider {
    getCurrentUserId(): string;
}
