import { DynamicModule } from '@nestjs/common';
export declare class SocialAuthModule {
    /**
     * Registers the SocialAuthModule asynchronously.
     *
     * @param options - The options used to configure the SocialAuthModule.
     * @returns {DynamicModule} - A dynamically created module with configured providers and imports.
     */
    static registerAsync(options: any): DynamicModule;
    /**
     * Creates an array of providers for connecting and configuring the SocialAuthService.
     *
     * @param options - The options used to specify the provider configuration.
     * @returns {Provider[]} - An array of providers to be registered in the module.
     */
    private static createConnectProviders;
}
