import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class FacebookController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates Facebook login.
     *
     * @param req
     */
    facebookLogin(_: Request): void;
    /**
     * Facebook login callback endpoint.
     *
     * @param context - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the Facebook login callback.
     */
    facebookLoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
