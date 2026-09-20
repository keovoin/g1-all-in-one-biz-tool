import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class GoogleController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates Google login.
     *
     * @param req
     */
    googleLogin(_: Request): void;
    /**
     * Google login callback endpoint.
     *
     * @param requestCtx - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the Google login callback.
     */
    googleLoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
