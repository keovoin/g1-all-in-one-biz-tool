import { BaseEntityModel } from '@gauzy/contracts';
import { HttpClient } from '@angular/common/http';
export declare abstract class Service<BE extends BaseEntityModel, FI = Partial<BE>, CI = Partial<BE>> {
    protected basePath: string;
    protected http: HttpClient;
    protected constructor({ http, basePath }: {
        basePath: string;
        http: HttpClient;
    });
    create(data: CI): Promise<BE>;
    find<L extends {
        items: BE[];
        total: number;
    }>(): Promise<L>;
    find(id: string): Promise<BE>;
    find<L extends {
        items: BE[];
        total: number;
    }>(relations: string[], filter: FI): Promise<L>;
    update(id: string, data: CI): Promise<BE>;
    delete(id: string): Promise<unknown>;
}
