import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class Auth0Controller {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Handles the initial Auth0 login request.
     *
     * @param req - The incoming request object, typically used to access request data or user information.
     */
    auth0Login(_: Request): void;
    /**
     * Handles the callback from Auth0 after a successful login.
     *
     * @param context - The context of the incoming request, including the authenticated user information.
     * @param res - The response object used to send a redirect or response to the client.
     * @returns {Promise<void>} - A promise that resolves after redirecting the user.
     */
    auth0LoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
