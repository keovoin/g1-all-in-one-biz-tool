import { UserService } from '../user/user.service';
export declare class EmailCheckService {
    private readonly userService;
    constructor(userService: UserService);
    /**
     * Checks if an email exists in the database.
     *
     * @param email - The email address to check.
     * @returns `true` if the email exists, otherwise `false`.
     */
    doesEmailExist(email: string): Promise<boolean>;
}
