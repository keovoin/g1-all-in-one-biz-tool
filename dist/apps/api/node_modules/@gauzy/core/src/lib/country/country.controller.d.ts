import { IPagination } from '@gauzy/contracts';
import { Country } from './country.entity';
import { CountryService } from './country.service';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    findAll(): Promise<IPagination<Country>>;
}
