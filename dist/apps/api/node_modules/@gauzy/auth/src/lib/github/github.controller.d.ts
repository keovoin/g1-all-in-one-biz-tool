import { Response, Request } from 'express';
import { SocialAuthService } from './../social-auth.service';
import { IIncomingRequest } from './../request-context.decorator';
export declare class GithubController {
    readonly service: SocialAuthService;
    constructor(service: SocialAuthService);
    /**
     * Initiates GitHub login.
     *
     * @param req
     */
    githubLogin(_req: Request): void;
    /**
     * GitHub login callback endpoint.
     *
     * @param _req - The context of the incoming request.
     * @param _res - The response object.
     * @returns The result of the GitHub login callback.
     */
    githubLoginCallback(context: IIncomingRequest, _res: Response): Promise<any>;
}
