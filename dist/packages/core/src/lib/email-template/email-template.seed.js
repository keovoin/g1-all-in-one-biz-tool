"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultEmailTemplates = void 0;
const fs = require("fs");
const email_template_entity_1 = require("./email-template.entity");
const mjml2html = require("mjml");
const path = require("path");
/**
 * Note: This seed file assumes the following directory structure in seeds/data/email/default-email-templates/ folder
 *
 * [template-name] / [language-code] / [template-type].mjml
 *
 * template-name: Is the name of the template
 * language-code: Is the ISO language code like bg, en, he, ru
 * template-type: Can be 'html', 'subject' or 'text' but needs to only have .hbs or .mjml extension
 */
const createDefaultEmailTemplates = async (dataSource) => {
    try {
        const templatePath = [
            'core',
            'seeds',
            'data',
            'default-email-templates'
        ];
        const files = [];
        let FOLDER_PATH = path.join(__dirname, '../', ...templatePath);
        FOLDER_PATH = fs.existsSync(FOLDER_PATH)
            ? FOLDER_PATH
            : path.resolve('.', ...templatePath.slice(2));
        findInDir(FOLDER_PATH, files);
        console.log(files);
        await fileToTemplate(dataSource, files);
    }
    catch (error) {
        // it's not a big issue for now if we can't create email templates
        console.error(error);
    }
};
exports.createDefaultEmailTemplates = createDefaultEmailTemplates;
function findInDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const fileStat = fs.lstatSync(filePath);
        if (fileStat.isDirectory()) {
            findInDir(filePath, fileList);
        }
        else {
            fileList.push(filePath);
        }
    });
}
const fileToTemplate = async (dataSource, files) => {
    for (const file of files) {
        const template = await pathToEmailTemplate(file);
        if (template && template.hbs) {
            await insertTemplate(dataSource, template);
        }
    }
};
const insertTemplate = async (dataSource, emailTemplate) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(email_template_entity_1.EmailTemplate)
        .values(emailTemplate)
        .execute();
};
const pathToEmailTemplate = async (fullPath) => {
    try {
        const template = new email_template_entity_1.EmailTemplate();
        // default template access for tenant organizations
        const templatePath = fullPath.replace(/\\/g, '/').split('/');
        const fileName = templatePath[templatePath.length - 1].split('.', 2);
        const fileExtension = fileName[1];
        const fileNameWithoutExtension = fileName[0];
        template.languageCode = templatePath[templatePath.length - 2];
        template.name = `${templatePath[templatePath.length - 3]}/${fileNameWithoutExtension}`;
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        switch (fileExtension) {
            case 'mjml':
                template.mjml = fileContent;
                template.hbs = mjml2html(fileContent).html;
                break;
            case 'hbs':
                template.hbs = fileContent;
                break;
            default:
                console.log(`Warning: ${path} Will be ignored. Only .hbs and .mjml files are supported!`);
                break;
        }
        if (!template.hbs) {
            return;
        }
        return template;
    }
    catch (error) {
        console.log('Something went wrong', path, error);
        return;
    }
};
//# sourceMappingURL=email-template.seed.js.map