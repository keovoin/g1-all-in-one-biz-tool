"use strict";
var ProductReviewsPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewsPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const product_review_entity_1 = require("./entities/product-review.entity");
const schema_extensions_1 = require("./graphql/schema-extensions");
let ProductReviewsPlugin = ProductReviewsPlugin_1 = class ProductReviewsPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${ProductReviewsPlugin_1.name} is being bootstrapped...`));
            console.log('ReviewsPlugin is being bootstrapped...');
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${ProductReviewsPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.ProductReviewsPlugin = ProductReviewsPlugin;
exports.ProductReviewsPlugin = ProductReviewsPlugin = ProductReviewsPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [],
        entities: [product_review_entity_1.ProductReview],
        extensions: {
            schema: schema_extensions_1.schemaExtensions,
            resolvers: []
        }
    })
], ProductReviewsPlugin);
//# sourceMappingURL=product-reviews.plugin.js.map