import { SeedDataService } from '@gauzy/core';
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
export declare class ChangelogSeederService {
    private readonly seeder;
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(seeder: SeedDataService);
    /**
     * Seed default change log.	 																																															*
     * @function
     */
    createBasicDefault(): Promise<void>;
}
