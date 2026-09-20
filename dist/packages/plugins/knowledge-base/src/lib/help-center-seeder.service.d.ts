import { ITenant } from '@gauzy/contracts';
import { SeedDataService } from '@gauzy/core';
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
export declare class HelpCenterSeederService {
    private readonly seeder;
    tenant: ITenant;
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(seeder: SeedDataService);
    /**
     * Seed all default help center and related methods.
     *
     * @function
     */
    createDefault(): Promise<void>;
    /**
     * Seed all random help center and related methods.
     *
     * @function
     */
    createRandom(): Promise<void>;
}
