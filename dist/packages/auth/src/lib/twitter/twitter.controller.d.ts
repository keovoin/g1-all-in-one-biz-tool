import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class TwitterController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates Twitter login.
     *
     * @param req
     */
    twitterLogin(_: Request): void;
    /**
     * Twitter login callback endpoint.
     *
     * @param context - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the Twitter login callback.
     */
    twitterLoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
