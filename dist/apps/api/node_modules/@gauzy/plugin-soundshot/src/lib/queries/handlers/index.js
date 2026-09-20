"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHandlers = void 0;
const get_soundshot_count_query_handler_1 = require("./get-soundshot-count-query.handler");
const get_soundshot_query_handler_1 = require("./get-soundshot-query.handler");
const get_soundshots_query_handler_1 = require("./get-soundshots-query.handler");
exports.queryHandlers = [get_soundshot_query_handler_1.GetSoundshotQueryHandler, get_soundshots_query_handler_1.GetSoundshotsQueryHandler, get_soundshot_count_query_handler_1.GetSoundshotCountQueryHandler];
//# sourceMappingURL=index.js.map