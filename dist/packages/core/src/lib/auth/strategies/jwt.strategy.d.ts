import { Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { EmployeeService } from '../../employee/employee.service';
import { RoleAuthorizationService } from '../../role/role-authorization.service';
import { UserOrganizationService } from '../../user-organization/user-organization.services';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly _authService;
    private readonly _employeeService;
    private readonly _userOrganizationService;
    private readonly _roleAuthorizationService;
    private readonly logger;
    loggingEnabled: boolean;
    constructor(_authService: AuthService, _employeeService: EmployeeService, _userOrganizationService: UserOrganizationService, _roleAuthorizationService: RoleAuthorizationService);
    /**
     * Validates the JWT payload.
     * @param {JwtPayload} payload - The JWT payload to validate.
     * @param {Function} done - The callback function to call when validation is complete.
     * @returns {void}
     */
    validate(payload: JwtPayload, done: (err: unknown, user?: unknown) => void): Promise<void>;
}
export {};
