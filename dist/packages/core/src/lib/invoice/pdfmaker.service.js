"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfmakerService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const config_1 = require("@gauzy/config");
let PdfmakerService = class PdfmakerService {
    setFilename(filename) {
        this._fileName = filename;
        return this;
    }
    get filename() {
        return this._fileName;
    }
    constructor(configService) {
        this.configService = configService;
        this._basename = '/invoices/pdf/';
        this.fonts = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        };
        this._fileName = `document-${(0, uuid_1.v4)()}`;
        this.public_path =
            this.configService.assetOptions.assetPublicPath || __dirname;
        this._dirname = path.join(this.public_path, this._basename);
    }
    /*
     * Generate Invoice/Estimate Pdf
     */
    async generatePdf(docDefinition) {
        try {
            const printer = new PdfPrinter(this.fonts);
            const pdfDefinition = {
                watermark: docDefinition['watermark'],
                content: docDefinition['content'],
                defaultStyle: {
                    font: 'Helvetica'
                }
            };
            if (!fs.existsSync(this._dirname)) {
                fs.mkdirSync(this._dirname, { recursive: true });
            }
            let filename = `${this.filename}.pdf`;
            const filePath = path.join(this._dirname, filename);
            return await new Promise((resolve, reject) => {
                const pdfDoc = printer.createPdfKitDocument(pdfDefinition, {});
                pdfDoc.pipe(fs.createWriteStream(filePath));
                const chunks = [];
                pdfDoc.on('readable', () => {
                    let chunk;
                    while ((chunk = pdfDoc.read()) !== null) {
                        chunks.push(chunk);
                    }
                });
                pdfDoc.on('end', async () => {
                    Buffer.concat(chunks);
                    if (!Buffer?.length)
                        return reject(new Error('PDF generation failed'));
                    try {
                        //convert pdf to Buffer
                        const pdf = await new Promise((resolve, reject) => {
                            try {
                                fs.readFile(filePath, {}, (err, data) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        //unlink after read pdf into Buffer form
                                        if (fs.existsSync(filePath)) {
                                            fs.unlinkSync(filePath);
                                        }
                                        resolve(data);
                                    }
                                });
                            }
                            catch (err) {
                                reject(err);
                            }
                        });
                        resolve(pdf);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                pdfDoc.end();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.PdfmakerService = PdfmakerService;
exports.PdfmakerService = PdfmakerService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], PdfmakerService);
//# sourceMappingURL=pdfmaker.service.js.map