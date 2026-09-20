import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class LinkedinController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates LinkedIn login.
     *
     * @param req
     */
    linkedinLogin(_: Request): void;
    /**
     * LinkedIn login callback endpoint.
     *
     * @param requestCtx - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the LinkedIn login callback.
     */
    linkedinLoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
