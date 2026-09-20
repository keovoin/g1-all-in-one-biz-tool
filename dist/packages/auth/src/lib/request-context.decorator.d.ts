interface IObject {
    [key: string]: any;
}
export interface IIncomingRequest {
    body: IObject;
    params: IObject;
    query: IObject;
    headers: IObject;
    req?: any;
    user?: any;
}
/**
 * RequestCtx decorator to extract and structure information from the HTTP request.
 */
export declare const RequestCtx: (...dataOrPipes: unknown[]) => ParameterDecorator;
export {};
