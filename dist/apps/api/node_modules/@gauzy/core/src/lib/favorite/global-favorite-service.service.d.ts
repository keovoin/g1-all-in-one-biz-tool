import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { BaseEntityEnum } from '@gauzy/contracts';
export declare class GlobalFavoriteDiscoveryService implements OnModuleInit {
    private readonly discoveryService;
    private readonly metadataScanner;
    private readonly reflector;
    private readonly serviceMap;
    constructor(discoveryService: DiscoveryService, metadataScanner: MetadataScanner, reflector: Reflector);
    onModuleInit(): void;
    private scanProviders;
    private extractTypeFromProvider;
    getService(type: BaseEntityEnum): any;
    callMethod(type: BaseEntityEnum, methodName: string, ...args: any[]): any;
}
