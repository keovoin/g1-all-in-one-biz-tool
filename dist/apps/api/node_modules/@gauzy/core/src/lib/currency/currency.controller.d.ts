import { IPagination } from '@gauzy/contracts';
import { Currency } from './currency.entity';
import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    findAll(): Promise<IPagination<Currency>>;
}
