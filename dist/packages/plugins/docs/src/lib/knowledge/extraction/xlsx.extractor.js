"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxExtractor = exports.XLSX_MAX_ROWS_PER_SHEET = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const errors_1 = require("../errors");
const extractor_interface_1 = require("./extractor.interface");
/** Row cap per sheet of the XLSX → markdown conversion (spec: 500 rows/sheet). */
exports.XLSX_MAX_ROWS_PER_SHEET = 500;
/**
 * XLSX extractor: sheet-aware — one GitHub-style pipe table per sheet under the
 * mandatory `## Sheet: <name>` locator heading (always emitted, even for one sheet —
 * it is the sheet locator). Caps 500 rows/sheet with a visible truncation note.
 * `pageCount` = non-empty sheets.
 */
let XlsxExtractor = class XlsxExtractor {
    /**
     * @inheritdoc
     */
    supports(mime) {
        return mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.load(buffer);
        }
        catch (error) {
            throw new errors_1.DocsPermanentError('The spreadsheet could not be read — it may be corrupt or password-protected.', error);
        }
        const sections = [];
        const warnings = [];
        let nonEmptySheets = 0;
        workbook.eachSheet((worksheet) => {
            const rows = [];
            let capped = false;
            const totalRows = worksheet.actualRowCount ?? worksheet.rowCount ?? 0;
            worksheet.eachRow({ includeEmpty: false }, (row) => {
                if (rows.length >= exports.XLSX_MAX_ROWS_PER_SHEET) {
                    capped = true;
                    return;
                }
                const cells = [];
                // row.values is 1-based; index 0 is always empty.
                const values = Array.isArray(row.values) ? row.values.slice(1) : [];
                for (const value of values) {
                    cells.push((0, extractor_interface_1.escapeTableCell)(this.cellToString(value)));
                }
                rows.push(cells);
            });
            if (rows.length === 0) {
                return; // empty sheet — not counted, not rendered
            }
            nonEmptySheets++;
            const width = Math.max(...rows.map((row) => row.length), 1);
            const pad = (row) => {
                const cells = [...row];
                while (cells.length < width) {
                    cells.push('');
                }
                return cells;
            };
            const header = pad(rows[0]);
            const lines = [
                `## Sheet: ${worksheet.name}`,
                '',
                `| ${header.join(' | ')} |`,
                `| ${header.map(() => '---').join(' | ')} |`,
                ...rows.slice(1).map((row) => `| ${pad(row).join(' | ')} |`)
            ];
            if (capped) {
                lines.push('', `_Truncated: only the first ${exports.XLSX_MAX_ROWS_PER_SHEET} of ${totalRows} rows are shown._`);
                warnings.push(`Sheet "${worksheet.name}" row cap applied (${exports.XLSX_MAX_ROWS_PER_SHEET})`);
            }
            sections.push(lines.join('\n'));
        });
        const rendered = sections.length > 0 ? sections.join('\n\n') : '_Empty workbook._';
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(rendered);
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: {
                pageCount: nonEmptySheets,
                truncated: truncated || warnings.length > 0,
                warnings: warnings.length > 0 ? warnings : undefined,
                wordCount: (0, extractor_interface_1.countWords)(markdown)
            }
        };
    }
    /**
     * Renders an ExcelJS cell value (rich text, formula results, dates, hyperlinks) as
     * plain text.
     */
    cellToString(value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (value instanceof Date) {
            return value.toISOString().slice(0, 10);
        }
        if (typeof value === 'object') {
            const anyValue = value;
            if (anyValue.richText && Array.isArray(anyValue.richText)) {
                return anyValue.richText.map((part) => part.text ?? '').join('');
            }
            if (anyValue.text !== undefined) {
                return String(anyValue.text); // hyperlink cells
            }
            if (anyValue.result !== undefined) {
                return this.cellToString(anyValue.result); // formula cells
            }
            if (anyValue.formula !== undefined) {
                return ''; // formula without cached result
            }
            if (anyValue.error !== undefined) {
                return String(anyValue.error);
            }
            return String(anyValue);
        }
        return String(value);
    }
};
exports.XlsxExtractor = XlsxExtractor;
exports.XlsxExtractor = XlsxExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], XlsxExtractor);
//# sourceMappingURL=xlsx.extractor.js.map