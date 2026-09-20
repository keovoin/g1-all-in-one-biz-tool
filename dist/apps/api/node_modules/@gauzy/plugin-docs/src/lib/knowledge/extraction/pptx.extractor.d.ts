import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** The canonical MIME of a PowerPoint presentation. */
export declare const PPTX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
/** Hard cap on slides rendered — a deck past this is a data dump, not a document. */
export declare const PPTX_MAX_SLIDES = 500;
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
export declare class PptxExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
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
    private resolveSlideOrder;
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
    private relationshipId;
    /**
     * Reads an OPC `.rels` part into `relationship id → resolved part name`.
     *
     * @param rels The `.rels` XML.
     * @param base The package folder the targets are relative to, e.g. `ppt/`.
     */
    private readRelationships;
    /**
     * Resolves an OPC relationship target against the part folder it was declared in
     * (`../notesSlides/notesSlide2.xml` from `ppt/slides/` → `ppt/notesSlides/notesSlide2.xml`).
     */
    private resolvePartName;
    /** `ppt/slides/slide12.xml` → 12; used only for the fallback ordering. */
    private partIndex;
    /**
     * Renders one slide's shapes: text bodies as lines, graphic-frame tables as pipe tables.
     *
     * @param pkg The presentation package.
     * @param slideName The slide part name.
     * @returns The slide's markdown lines (possibly empty for a picture-only slide).
     */
    private renderSlide;
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
    private renderNotes;
    /**
     * The text of one shape, one line per `<a:p>` paragraph, empty paragraphs dropped.
     */
    private paragraphLines;
    /** One PresentationML table as a grid of plain cell strings. */
    private tableRows;
    /** The shape's placeholder type (`title`, `body`, `sldNum`, …), when it is a placeholder. */
    private placeholderType;
    /** Whether the shape is page furniture (slide number / date / footer). */
    private isFurniture;
}
