import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy } from 'passport-jwt';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { UserService } from './../../user/user.service';
declare const JwtRefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private readonly userService;
    private readonly refreshTokenService;
    constructor(userService: UserService, refreshTokenService: RefreshTokenService);
    /**
     * Validates the refresh token and payload to ensure user authorization.
     *
     * @param request - The incoming request, expected to contain the refresh token in its body.
     * @param payload - The JWT payload to validate.
     * @param done - The callback function to be called upon validation completion.
     */
    validate(request: Request, payload: JwtPayload, done: (err: unknown, user?: unknown) => void): Promise<void>;
}
export {};
