"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = void 0;
const chalk = require("chalk");
const DEFAULT_CONTEXT = `Bootstrap Server`;
class DefaultLogger {
    get defaultContext() {
        return this._defaultContext;
    }
    set defaultContext(context) {
        this._defaultContext = context;
    }
    constructor(options) {
        this.logger = console.log;
        this._defaultContext = DEFAULT_CONTEXT;
    }
    log(message, context) {
        this.printLog(chalk.green.bold(`info`), message, context);
    }
    error(message, context, trace) {
        this.printLog(chalk.red.bold(`error`), message, context);
    }
    warn(message, context) {
        this.printLog(chalk.yellow.bold(`warn`), message, context);
    }
    info(message, context) {
        this.printLog(chalk.green.bold(`info`), message, context);
    }
    verbose(message, context) {
        this.printLog(chalk.green.bold(`verbose`), message, context);
    }
    debug(message, context) {
        this.printLog(chalk.green.bold(`debug`), message, context);
    }
    printLog(prefix, message, context) {
        this.logger([prefix, this.printContext(context), message].join(' '));
    }
    printContext(context) {
        return chalk.cyan(`[${context || this.defaultContext}]`);
    }
}
exports.DefaultLogger = DefaultLogger;
//# sourceMappingURL=default-logger.js.map