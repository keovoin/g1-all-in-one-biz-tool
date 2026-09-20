import { DynamicModule } from '@nestjs/common';
import { GraphQLApiConfigurationOptions } from '@gauzy/common';
import { ConfigService } from '@gauzy/config';
export declare class GraphqlModule {
    /**
     * Register GraphQL module asynchronously.
     * @param optionsFactory Factory function to provide GraphQL configuration options.
     * @returns Dynamic module configuration.
     */
    static registerAsync(optionsFactory: (configService: ConfigService) => GraphQLApiConfigurationOptions): DynamicModule;
}
