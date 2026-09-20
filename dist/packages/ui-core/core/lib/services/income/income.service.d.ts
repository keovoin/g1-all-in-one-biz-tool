import { HttpClient } from '@angular/common/http';
import { IIncome, IIncomeCreateInput, IIncomeFindInput, IIncomeUpdateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class IncomeService {
    private readonly http;
    constructor(http: HttpClient);
    create(createInput: IIncomeCreateInput): Promise<IIncome>;
    getMyAll(relations?: string[], findInput?: IIncomeFindInput, filterDate?: Date): Promise<IPagination<IIncome>>;
    getAll(relations?: string[], findInput?: IIncomeFindInput, filterDate?: Date): Promise<IPagination<IIncome>>;
    update(id: string, updateInput: IIncomeUpdateInput): Promise<IIncome>;
    delete(incomeId: string, input: IIncomeFindInput): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IncomeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IncomeService>;
}
