import { ConnectionEntityManager, SeedDataService } from '@gauzy/core';
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
export declare class ProposalSeederService {
    private readonly _connectionEntityManager;
    private readonly _seeder;
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(_connectionEntityManager: ConnectionEntityManager, _seeder: SeedDataService);
    /**
     * Creates default proposals for organizations.
     *
     * @returns A Promise that resolves when the default proposals are created.
     */
    createDefaultProposals(): Promise<void>;
    /**
     * Creates random proposals for organizations.
     *
     * @returns A Promise that resolves when the random proposals are created.
     */
    createRandomProposals(): Promise<void>;
}
