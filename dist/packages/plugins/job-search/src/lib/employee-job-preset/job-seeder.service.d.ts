import { ConnectionEntityManager, SeedDataService } from '@gauzy/core';
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
export declare class JobSeederService {
    private readonly connectionEntityManager;
    private readonly seeder;
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(connectionEntityManager: ConnectionEntityManager, seeder: SeedDataService);
    /**
     * Seeds job data into the database.
     *
     * This function seeds default job search categories and occupations using the provided connection,
     * tenant, and default organization. It logs the seeding process and any errors encountered.
     */
    seedDefaultJobsData(): Promise<void>;
}
