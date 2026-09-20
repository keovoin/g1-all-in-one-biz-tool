"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHandlers = void 0;
const get_camshot_query_handler_1 = require("./get-camshot-query.handler");
const list_camshot_query_handler_1 = require("./list-camshot-query.handler");
const get_camshot_count_query_handler_1 = require("./get-camshot-count-query.handler");
exports.queryHandlers = [
    list_camshot_query_handler_1.ListCamshotQueryHandler,
    get_camshot_query_handler_1.GetCamshotQueryHandler,
    get_camshot_count_query_handler_1.GetCamshotCountQueryHandler
];
//# sourceMappingURL=index.js.map