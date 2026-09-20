import { HttpClient } from '@angular/common/http';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
export declare class ServerConnectionService {
    private readonly httpClient;
    private readonly store;
    constructor(httpClient: HttpClient, store: Store);
    checkServerConnection(endPoint: string): Promise<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ServerConnectionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ServerConnectionService>;
}
