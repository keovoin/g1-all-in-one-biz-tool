"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaExtensions = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.schemaExtensions = (0, graphql_tag_1.gql) `
	type ProductReview {
		id: ID!
		body: String
		rating: Float!
	}
`;
//# sourceMappingURL=schema-extensions.js.map