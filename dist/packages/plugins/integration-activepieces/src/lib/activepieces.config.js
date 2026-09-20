"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVEPIECES_PIECE_NAME = exports.ACTIVEPIECES_MCP_SERVERS_URL = exports.ACTIVEPIECES_CONNECTIONS_URL = exports.ACTIVEPIECES_API_URL = exports.ACTIVEPIECES_BASE_URL = void 0;
/** ActivePieces Base URL */
exports.ACTIVEPIECES_BASE_URL = process.env['ACTIVEPIECES_BASE_URL'] || 'https://cloud.activepieces.com';
/** ActivePieces API base URL */
exports.ACTIVEPIECES_API_URL = `${exports.ACTIVEPIECES_BASE_URL}/api/v1`;
/** ActivePieces connection endpoints */
exports.ACTIVEPIECES_CONNECTIONS_URL = `${exports.ACTIVEPIECES_API_URL}/app-connections`;
/** ActivePieces MCP Server endpoints */
exports.ACTIVEPIECES_MCP_SERVERS_URL = `${exports.ACTIVEPIECES_API_URL}/mcp-servers`;
/** ActivePieces Piece name */
exports.ACTIVEPIECES_PIECE_NAME = 'Ever-gauzy';
//# sourceMappingURL=activepieces.config.js.map