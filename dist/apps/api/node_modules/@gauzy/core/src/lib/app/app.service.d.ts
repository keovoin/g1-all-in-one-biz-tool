import { SeedDataService } from '../core/seeds/seed-data.service';
import { UserService } from '../user/user.service';
export declare class AppService {
    private readonly seedDataService;
    private readonly userService;
    userCount: number;
    constructor(seedDataService: SeedDataService, userService: UserService);
    /**
     * Seed DB if no users exists (for simplicity and safety we only re-seed DB if no users found)
     * TODO: this should actually include more checks, e.g. if schema migrated and many other things
     */
    seedDBIfEmpty(): Promise<void>;
    seedDemoIfEmpty(): Promise<void>;
}
