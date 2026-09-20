import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { environment } from '@gauzy/ui-config';
import { AVATAR_DEFAULT_SVG, DEFAULT_SVG } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
/**
 * Static cache for default image URLs to avoid recomputation across instances.
 * Uses a Map for O(1) lookup performance.
 */
const DEFAULT_IMAGE_CACHE = new Map();
/**
 * Resolves the default fallback image URL for the given image type.
 * Uses a static cache to avoid recomputing URLs across directive instances.
 *
 * @param type - The type of image ('user' for avatar, 'default' for generic)
 * @returns The resolved default image URL with environment-specific prefix
 */
function resolveDefaultImageUrl(type) {
    const cacheKey = `${type}-${environment.IS_ELECTRON}`;
    // Check cache first (O(1) lookup)
    const cached = DEFAULT_IMAGE_CACHE.get(cacheKey);
    if (cached !== undefined) {
        return cached;
    }
    // Resolve the appropriate SVG asset based on type
    const svgAsset = type === 'user' ? AVATAR_DEFAULT_SVG : DEFAULT_SVG;
    // Build URL with environment-specific prefix
    const url = environment.IS_ELECTRON ? `./${svgAsset}` : `/${svgAsset}`;
    // Cache for future lookups
    DEFAULT_IMAGE_CACHE.set(cacheKey, url);
    return url;
}
/**
 * Fast URL normalization check using regex for better performance.
 */
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
/**
 * Directive that handles image loading with fallback to default images.
 * Optimized for performance with lazy initialization and efficient DOM operations.
 */
export class ImgDirective {
    constructor() {
        this.el = inject(ElementRef).nativeElement;
        this.renderer = inject(Renderer2);
        this.type = 'default';
        this.skipDefaultImage = false;
        this.enableFadeIn = true; // Make fade-in optional
        this.listeners = [];
        this.originalSrc = null;
        this.isImageLoaded = false;
        this.needsFadeIn = false;
    }
    /**
     * Normalizes the image source URL based on the environment.
     * Optimized with regex check for absolute URLs.
     */
    normalizeSrc(src) {
        if (!src) {
            return null;
        }
        // Fast check for absolute URLs using regex
        if (ABSOLUTE_URL_REGEX.test(src)) {
            return src;
        }
        // Add environment-specific prefix
        return environment.IS_ELECTRON ? `./${src}` : `/${src}`;
    }
    /**
     * Checks if the image is already loaded (cached images).
     * This allows us to skip unnecessary event listener setup.
     */
    isImageAlreadyLoaded() {
        return this.el.complete && this.el.naturalHeight > 0;
    }
    /**
     * Applies styles in a batched manner using requestAnimationFrame for better performance.
     */
    applyStyles(styles) {
        // Cancel any pending RAF
        if (this.rafId !== undefined) {
            cancelAnimationFrame(this.rafId);
        }
        this.rafId = requestAnimationFrame(() => {
            for (const [property, value] of Object.entries(styles)) {
                this.renderer.setStyle(this.el, property, value);
            }
            this.rafId = undefined;
        });
    }
    /**
     * Initializes the directive by setting up the image source and event listeners.
     * Optimized to skip work if image is already loaded.
     */
    ngOnInit() {
        // Get and normalize the source
        const currentSrc = this.el.getAttribute('src');
        const normalizedSrc = this.normalizeSrc(currentSrc);
        if (normalizedSrc && normalizedSrc !== currentSrc) {
            this.renderer.setAttribute(this.el, 'src', normalizedSrc);
            this.originalSrc = normalizedSrc;
        }
        else if (normalizedSrc) {
            this.originalSrc = normalizedSrc;
        }
        // Check if image is already loaded (cached images)
        if (this.isImageAlreadyLoaded()) {
            this.isImageLoaded = true;
            // Image is already loaded, no need for fade-in or listeners
            return;
        }
        // Error listener is ESSENTIAL - we must handle broken images
        const errorCleanup = this.renderer.listen(this.el, 'error', () => this.handleError());
        this.listeners.push(errorCleanup);
        // Load listener: needed for fade-in effect OR to clean up error listener when image loads
        if (this.enableFadeIn) {
            this.needsFadeIn = true;
            this.applyStyles({
                opacity: '0',
                transition: 'opacity 0.2s ease-in-out'
            });
        }
        // Always set up load listener to clean up error listener when image loads successfully
        const loadCleanup = this.renderer.listen(this.el, 'load', () => this.handleLoad());
        this.listeners.push(loadCleanup);
    }
    /**
     * Handles the error event when the image fails to load.
     * This is the only essential listener - we must handle errors.
     */
    handleError() {
        if (this.isImageLoaded) {
            return;
        }
        // Remove error listener to prevent infinite loops
        this.cleanupListeners();
        if (this.skipDefaultImage) {
            // Hide the image instead of showing default
            this.renderer.setStyle(this.el, 'display', 'none');
            return;
        }
        // Store original source before replacing (only if not already stored)
        if (!this.originalSrc) {
            this.originalSrc = this.el.getAttribute('src');
        }
        // Get cached default fallback URL
        const defaultUrl = resolveDefaultImageUrl(this.type);
        // Batch DOM operations
        this.renderer.setAttribute(this.el, 'src', defaultUrl);
        if (this.originalSrc) {
            this.renderer.setAttribute(this.el, 'data-original-src', this.originalSrc);
        }
        // Use classList API for better performance
        this.el.classList.add('default-image', `default-image-${this.type}`);
        // Show the default image
        this.applyStyles({ opacity: '1' });
    }
    /**
     * Handles the load event when the image successfully loads.
     * Only needed for fade-in effect - could potentially be removed if fade-in isn't critical.
     */
    handleLoad() {
        this.isImageLoaded = true;
        // Only update styles if fade-in was set up
        if (this.needsFadeIn) {
            // Ensure element is visible (in case it was hidden)
            if (this.el.style.display === 'none') {
                this.renderer.removeStyle(this.el, 'display');
            }
            // Fade in the image
            this.applyStyles({ opacity: '1' });
        }
        // Clean up listeners as image is loaded (no longer needed)
        this.cleanupListeners();
    }
    /**
     * Cleans up all event listeners at once.
     */
    cleanupListeners() {
        this.listeners.forEach((cleanup) => cleanup());
        this.listeners = [];
    }
    /**
     * Cleans up all event listeners and pending animations when the directive is destroyed.
     */
    ngOnDestroy() {
        // Cancel any pending animation frame
        if (this.rafId !== undefined) {
            cancelAnimationFrame(this.rafId);
            this.rafId = undefined;
        }
        // Clean up all listeners
        this.cleanupListeners();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImgDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: ImgDirective, isStandalone: true, selector: "img", inputs: { type: "type", skipDefaultImage: "skipDefaultImage", enableFadeIn: "enableFadeIn" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImgDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'img',
                    standalone: true
                }]
        }], propDecorators: { type: [{
                type: Input
            }], skipDefaultImage: [{
                type: Input
            }], enableFadeIn: [{
                type: Input
            }] } });
//# sourceMappingURL=img.directive.js.map