"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateReaderService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const path = require("path");
const utils_1 = require("./utils");
let EmailTemplateReaderService = class EmailTemplateReaderService {
    get folderPath() {
        return this._folderPath;
    }
    set folderPath(value) {
        this._folderPath = value;
    }
    constructor() { }
    onModuleInit() {
        this.folderPath = path.join(path.join(__dirname), '../', ...utils_1.EmailTemplateUtils.globalPath);
    }
    /**
     * Read email template from core folder using name
     *
     * @param name
     */
    readEmailTemplate(folder) {
        const files = [];
        if (utils_1.EmailTemplateUtils.fileExists(this.folderPath)) {
            const folderPath = path.join(this.folderPath, folder);
            // Read directory for missing templates
            utils_1.EmailTemplateUtils.readdirSync(folderPath, files);
        }
        // Convert files to email templates
        return utils_1.EmailTemplateUtils.filesToTemplates(files);
    }
};
exports.EmailTemplateReaderService = EmailTemplateReaderService;
exports.EmailTemplateReaderService = EmailTemplateReaderService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], EmailTemplateReaderService);
//# sourceMappingURL=email-template-reader.service.js.map