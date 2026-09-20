"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PptxExtractor = exports.PPTX_MAX_SLIDES = exports.PPTX_MIME_TYPE = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const errors_1 = require("../errors");
const extractor_interface_1 = require("./extractor.interface");
const office_markdown_util_1 = require("./office-markdown.util");
const office_package_util_1 = require("./office-package.util");
const office_xml_util_1 = require("./office-xml.util");
/** The canonical MIME of a PowerPoint presentation. */
exports.PPTX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
/** Hard cap on slides rendered — a deck past this is a data dump, not a document. */
exports.PPTX_MAX_SLIDES = 500;
/**
 * Placeholder types whose text is page furniture, not content: slide number, date, footer.
 * Extracting them would put "3" and "Confidential" into every single slide's text.
 */
const FURNITURE_PLACEHOLDERS = new Set(['sldNum', 'dt', 'ftr']);
/** PresentationML elements that stand for a literal rather than carrying text. */
const TEXT_REPLACEMENTS = { br: '\n' };
/**
 * PPTX extractor: one `## Page N` section per slide, in the deck's real presentation order,
 * with the slide's shape text as lines, tables as GitHub-style pipe tables, and the speaker
 * notes as a `> Notes:` blockquote.
 *
 * `## Page N` is the machine locator shape the citation layer parses (§4.1), which is why a
 * slide is a "page" here rather than a "slide" — a chat citation reading `p.3` has to mean the
 * same thing whether the source was a PDF or a deck.
 *
 * Parsing is first-party (`office-package.util` + `office-xml.util`): PresentationML has no
 * parser in the dependency tree, and both files exist so accepting `.pptx` on upload is backed
 * by an extractor rather than by a guaranteed `FAILED`.
 */
let PptxExtractor = class PptxExtractor {
    /**
     * @inheritdoc
     */
    supports(mime) {
        return mime === exports.PPTX_MIME_TYPE;
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        const pkg = (0, office_package_util_1.openOfficePackage)(buffer);
        const slideNames = this.resolveSlideOrder(pkg);
        if (!slideNames.length) {
            throw new errors_1.DocsPermanentError('The presentation contains no slides — it may be corrupt.');
        }
        const warnings = [];
        const rendered = slideNames.slice(0, exports.PPTX_MAX_SLIDES);
        if (slideNames.length > rendered.length) {
            warnings.push(`Only the first ${exports.PPTX_MAX_SLIDES} of ${slideNames.length} slides were extracted.`);
        }
        const sections = [];
        rendered.forEach((slideName, index) => {
            const lines = [`## Page ${index + 1}`, ''];
            lines.push(...this.renderSlide(pkg, slideName));
            const notes = this.renderNotes(pkg, slideName);
            if (notes.length) {
                lines.push('', ...notes);
            }
            sections.push((0, office_markdown_util_1.joinBlocks)(lines));
        });
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(sections.join('\n\n'));
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: {
                pageCount: rendered.length,
                truncated: truncated || warnings.length > 0,
                warnings: warnings.length > 0 ? warnings : undefined,
                wordCount: (0, extractor_interface_1.countWords)(markdown)
            }
        };
    }
    /* ------------------------------------------------------------------ */
    /* Slide order                                                        */
    /* ------------------------------------------------------------------ */
    /**
     * The slide part names in PRESENTATION order.
     *
     * 🛑 Not the numeric order of `slideN.xml`: PowerPoint keeps a slide's original part name
     * when the deck is reordered, so `slide3.xml` is routinely the first slide. The authoritative
     * order is `<p:sldIdLst>` in `ppt/presentation.xml`, resolved through the presentation's
     * relationships — getting this wrong would make every `## Page N` citation point at the
     * wrong slide.
     *
     * Falls back to numeric part order when either part is missing or unreadable, which is still
     * right for any deck that was never reordered.
     *
     * @param pkg The opened presentation package.
     * @returns The ordered slide part names.
     */
    resolveSlideOrder(pkg) {
        const available = pkg
            .names()
            .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
            .sort((left, right) => this.partIndex(left) - this.partIndex(right));
        const presentation = pkg.readText('ppt/presentation.xml');
        const rels = pkg.readText('ppt/_rels/presentation.xml.rels');
        if (!presentation || !rels || !available.length) {
            return available;
        }
        try {
            const targetsById = this.readRelationships(rels, 'ppt/');
            const ordered = (0, office_xml_util_1.findAll)((0, office_xml_util_1.parseXml)(presentation), 'sldId')
                .map((slideId) => targetsById.get(this.relationshipId(slideId) ?? ''))
                .filter((target) => Boolean(target) && available.includes(target));
            // Any slide the list did not mention is appended, so a deck with a damaged
            // `<p:sldIdLst>` still yields all of its content.
            const missing = available.filter((name) => !ordered.includes(name));
            return ordered.length ? [...ordered, ...missing] : available;
        }
        catch {
            return available;
        }
    }
    /**
     * The OPC relationship id of an element that references another part.
     *
     * 🛑 Must match the NAMESPACED attribute: `<p:sldId id="256" r:id="rId2"/>` carries both, and
     * `id` is the slide's own numeric id — reading that one finds no relationship, the slide
     * order silently degrades to part order, and every `## Page N` citation in a reordered deck
     * points at the wrong slide with nothing failing anywhere.
     *
     * @param node The element carrying the reference.
     * @returns The relationship id, when the element has a namespaced `id` attribute.
     */
    relationshipId(node) {
        for (const [key, value] of Object.entries(node.attributes)) {
            const colon = key.indexOf(':');
            if (colon !== -1 && key.slice(colon + 1) === 'id') {
                return value;
            }
        }
        return undefined;
    }
    /**
     * Reads an OPC `.rels` part into `relationship id → resolved part name`.
     *
     * @param rels The `.rels` XML.
     * @param base The package folder the targets are relative to, e.g. `ppt/`.
     */
    readRelationships(rels, base) {
        const map = new Map();
        for (const relationship of (0, office_xml_util_1.findAll)((0, office_xml_util_1.parseXml)(rels), 'Relationship')) {
            const id = (0, office_xml_util_1.attribute)(relationship, 'Id');
            const target = (0, office_xml_util_1.attribute)(relationship, 'Target');
            if (id && target) {
                map.set(id, this.resolvePartName(base, target));
            }
        }
        return map;
    }
    /**
     * Resolves an OPC relationship target against the part folder it was declared in
     * (`../notesSlides/notesSlide2.xml` from `ppt/slides/` → `ppt/notesSlides/notesSlide2.xml`).
     */
    resolvePartName(base, target) {
        if (target.startsWith('/')) {
            return target.slice(1);
        }
        const segments = `${base}${target}`.split('/');
        const resolved = [];
        for (const segment of segments) {
            if (segment === '.' || segment === '')
                continue;
            if (segment === '..')
                resolved.pop();
            else
                resolved.push(segment);
        }
        return resolved.join('/');
    }
    /** `ppt/slides/slide12.xml` → 12; used only for the fallback ordering. */
    partIndex(name) {
        const match = /(\d+)\.xml$/.exec(name);
        return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
    }
    /* ------------------------------------------------------------------ */
    /* Slide + notes rendering                                            */
    /* ------------------------------------------------------------------ */
    /**
     * Renders one slide's shapes: text bodies as lines, graphic-frame tables as pipe tables.
     *
     * @param pkg The presentation package.
     * @param slideName The slide part name.
     * @returns The slide's markdown lines (possibly empty for a picture-only slide).
     */
    renderSlide(pkg, slideName) {
        const xml = pkg.readText(slideName);
        if (!xml) {
            return [];
        }
        let slide;
        try {
            slide = (0, office_xml_util_1.parseXml)(xml);
        }
        catch {
            // One unreadable slide must not lose the whole deck.
            return [];
        }
        const lines = [];
        for (const shape of (0, office_xml_util_1.findAll)(slide, 'sp')) {
            if (this.isFurniture(shape))
                continue;
            const shapeLines = this.paragraphLines(shape);
            if (shapeLines.length) {
                lines.push(...shapeLines, '');
            }
        }
        for (const table of (0, office_xml_util_1.findAll)(slide, 'tbl')) {
            const rendered = (0, office_markdown_util_1.renderPipeTable)(this.tableRows(table));
            if (rendered) {
                lines.push(rendered, '');
            }
        }
        return lines;
    }
    /**
     * Renders the slide's speaker notes as a `> Notes:` blockquote.
     *
     * The notes part is reached through the SLIDE's relationships rather than by matching
     * `notesSlideN.xml` to `slideN.xml`: the two numberings are independent, and a deck where
     * only some slides have notes would otherwise attach them to the wrong slides.
     *
     * @param pkg The presentation package.
     * @param slideName The slide part name.
     * @returns The blockquote lines, or an empty array when the slide has no notes.
     */
    renderNotes(pkg, slideName) {
        const slideFolder = `${slideName.slice(0, slideName.lastIndexOf('/'))}/`;
        const relsName = `${slideFolder}_rels/${slideName.slice(slideName.lastIndexOf('/') + 1)}.rels`;
        const rels = pkg.readText(relsName);
        if (!rels) {
            return [];
        }
        let notesName;
        try {
            for (const relationship of (0, office_xml_util_1.findAll)((0, office_xml_util_1.parseXml)(rels), 'Relationship')) {
                if (((0, office_xml_util_1.attribute)(relationship, 'Type') ?? '').endsWith('/notesSlide')) {
                    notesName = this.resolvePartName(slideFolder, (0, office_xml_util_1.attribute)(relationship, 'Target') ?? '');
                    break;
                }
            }
        }
        catch {
            return [];
        }
        const xml = notesName ? pkg.readText(notesName) : undefined;
        if (!xml) {
            return [];
        }
        let notes;
        try {
            notes = (0, office_xml_util_1.parseXml)(xml);
        }
        catch {
            return [];
        }
        const lines = [];
        for (const shape of (0, office_xml_util_1.findAll)(notes, 'sp')) {
            // A notes page also carries the slide-image placeholder and the page number; only the
            // body placeholder holds what the presenter actually wrote.
            if (this.placeholderType(shape) !== 'body')
                continue;
            lines.push(...this.paragraphLines(shape));
        }
        const written = lines.filter((line) => line.trim().length > 0);
        if (!written.length) {
            return [];
        }
        return [`> Notes: ${written[0]}`, ...written.slice(1).map((line) => `> ${line}`)];
    }
    /**
     * The text of one shape, one line per `<a:p>` paragraph, empty paragraphs dropped.
     */
    paragraphLines(shape) {
        return (0, office_xml_util_1.findAll)(shape, 'p')
            .map((paragraph) => (0, office_xml_util_1.textContent)(paragraph, TEXT_REPLACEMENTS).replace(/\s+/g, ' ').trim())
            .filter((line) => line.length > 0);
    }
    /** One PresentationML table as a grid of plain cell strings. */
    tableRows(table) {
        return (0, office_xml_util_1.findAll)(table, 'tr').map((row) => (0, office_xml_util_1.findAll)(row, 'tc').map((cell) => (0, office_xml_util_1.textContent)(cell, TEXT_REPLACEMENTS).replace(/\s+/g, ' ').trim()));
    }
    /** The shape's placeholder type (`title`, `body`, `sldNum`, …), when it is a placeholder. */
    placeholderType(shape) {
        const placeholder = (0, office_xml_util_1.findFirst)(shape, 'ph');
        return placeholder ? (0, office_xml_util_1.attribute)(placeholder, 'type') : undefined;
    }
    /** Whether the shape is page furniture (slide number / date / footer). */
    isFurniture(shape) {
        const type = this.placeholderType(shape);
        return type !== undefined && FURNITURE_PLACEHOLDERS.has(type);
    }
};
exports.PptxExtractor = PptxExtractor;
exports.PptxExtractor = PptxExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PptxExtractor);
//# sourceMappingURL=pptx.extractor.js.map