"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCtx = void 0;
const common_1 = require("@nestjs/common");
/**
 * RequestCtx decorator to extract and structure information from the HTTP request.
 */
exports.RequestCtx = (0, common_1.createParamDecorator)(async (data, ctx) => {
    // Extract the 'req' object from the current execution context.
    const req = ctx.switchToHttp().getRequest();
    // Extract information from the 'req' object.
    const body = req.body;
    const headers = req.headers;
    const params = req.params;
    const query = req.query;
    const user = req.user;
    // Structure the extracted information into an IIncomingRequest object.
    const result = {
        body,
        headers,
        params,
        query,
        user
    };
    // Return the structured result.
    return result;
});
//# sourceMappingURL=request-context.decorator.js.map