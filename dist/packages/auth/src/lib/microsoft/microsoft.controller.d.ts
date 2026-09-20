import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class MicrosoftController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates Microsoft login.
     *
     * @param req
     */
    microsoftLogin(_: Request): void;
    /**
     * Microsoft login callback endpoint.
     *
     * @param requestCtx - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the Microsoft login callback.
     */
    microsoftLoginCallback(context: IIncomingRequest, res: Response): Promise<any>;
}
