/**
 * Gauzy AI Configuration
 */
declare const _default: (() => {
    gauzyAIGraphQLEndpoint: string;
    gauzyAIRESTEndpoint: string;
    gauzyAIRequestTimeout: number;
    gauzyAiApiKey: string;
    gauzyAiApiSecret: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    gauzyAIGraphQLEndpoint: string;
    gauzyAIRESTEndpoint: string;
    gauzyAIRequestTimeout: number;
    gauzyAiApiKey: string;
    gauzyAiApiSecret: string;
}>;
export default _default;
