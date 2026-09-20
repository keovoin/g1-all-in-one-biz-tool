import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class InventoryStore {
    constructor(translateService) {
        this.translateService = translateService;
        this.productTypesLoaded = false;
        this.productCategoriesLoaded = false;
        this._activeProduct = this.inventoryItemBlank;
        this._variantCreateInputs = [];
        this._deleteOptions = [];
        this._deletedOptionGroups = [];
        this._optionGroups = [];
        this._productCategories = [];
        this._productTypes = [];
        this._activeTab = null;
        this.activeProduct$ = new BehaviorSubject(this.activeProduct);
        this.variantCreateInputs$ = new BehaviorSubject(this.variantCreateInputs);
        this.optionGroups$ = new BehaviorSubject(this._optionGroups);
        this.deleteOptions$ = new BehaviorSubject(this.deleteOptions);
        this.deletedOptionGroups$ = new BehaviorSubject(this.deletedOptionGroups);
        this.activeTab$ = new BehaviorSubject(this.activeTab);
        this.warehouseProductsCountUpdate$ = new Subject();
    }
    get activeProduct() {
        return this._activeProduct;
    }
    get gallery() {
        return this._activeProduct.gallery;
    }
    get featuredImage() {
        return this._activeProduct.featuredImage;
    }
    get storedVariants() {
        return this._activeProduct.variants;
    }
    get variantCreateInputs() {
        return this._variantCreateInputs;
    }
    get createOptionCombinations() {
        return this._variantCreateInputs
            .filter((variant) => !variant.isStored)
            .map((variant) => ({ options: variant.options }));
    }
    get deleteOptions() {
        return this._deleteOptions;
    }
    get deletedOptionGroups() {
        return this._deletedOptionGroups;
    }
    get optionGroups() {
        return this._optionGroups;
    }
    get createOptionGroups() {
        return this._optionGroups.filter((optionGroup) => !optionGroup.id);
    }
    get updateOptionGroups() {
        return this._optionGroups.filter((optionGroup) => optionGroup.id);
    }
    get activeTab() {
        return this._activeTab;
    }
    get productTypes() {
        return this._productTypes;
    }
    get productCategories() {
        return this._productCategories;
    }
    set activeProduct(product) {
        this._activeProduct = { ...this.activeProduct, ...product };
        this.activeProduct$.next(this._activeProduct);
    }
    set variantCreateInputs(variantCreateInputs) {
        this._variantCreateInputs = variantCreateInputs;
        this.variantCreateInputs$.next(this._variantCreateInputs);
    }
    set optionGroups(optionGroups) {
        this._optionGroups = optionGroups;
        this.optionGroups$.next(this._optionGroups);
    }
    set activeTab(tab) {
        this._activeTab = tab;
        this.activeTab$.next(this._activeTab);
    }
    set productCategories(productCategoriesInput) {
        this._productCategories = productCategoriesInput;
        this.productTypesLoaded = true;
    }
    set productTypes(productTypesInput) {
        this._productTypes = productTypesInput;
        this.productCategoriesLoaded = true;
    }
    updateGallery(gallery) {
        this.activeProduct.gallery = gallery;
        this.activeProduct$.next(this.activeProduct);
    }
    addGalleryImages(images) {
        this.activeProduct.gallery.push(...images);
        this.activeProduct$.next(this.activeProduct);
    }
    deleteGalleryImage(image) {
        this.activeProduct.gallery = this.activeProduct.gallery.filter((img) => img.id !== image.id);
        if (this.activeProduct.featuredImage && this.activeProduct.featuredImage.id == image.id) {
            this.activeProduct.featuredImage = null;
        }
        this.activeProduct$.next(this.activeProduct);
    }
    initVariantCreateInputs() {
        this._variantCreateInputs = this.activeProduct.variants.map((variant) => {
            return {
                options: variant.options.map((option) => option.name),
                optionsFull: variant.options,
                isStored: true,
                id: variant.id,
                productId: this.activeProduct.id
            };
        });
        this.variantCreateInputs$.next(this._variantCreateInputs);
    }
    addVariantCreateInput(variantCreateInput) {
        this._variantCreateInputs.push(variantCreateInput);
        this.variantCreateInputs$.next(this.variantCreateInputs);
    }
    updateVariantInputsOnDeletedOption(deletedOption) {
        let variantsUsingOption = this.variantCreateInputs.filter((variant) => variant.options.find((option) => option == deletedOption.name));
        variantsUsingOption.forEach((variant) => {
            variant.options = variant.options.filter((option) => option != deletedOption.name);
        });
        this._variantCreateInputs = this.variantCreateInputs.filter((variantCreateInput) => variantCreateInput.options.length);
        this.variantCreateInputs$.next(this._variantCreateInputs);
    }
    deleteVariant(variantDeleted) {
        this.activeProduct.variants = this.activeProduct.variants.filter((variant) => variant.id != variantDeleted.id);
        this.activeProduct$.next(this.activeProduct);
    }
    updateFeaturedImage(image) {
        this.activeProduct.featuredImage = image;
        this.activeProduct$.next(this.activeProduct);
    }
    isFeaturedImage(image) {
        if (!this.activeProduct.featuredImage)
            return false;
        return this.activeProduct.featuredImage.id == image.id;
    }
    clearCurrentProduct() {
        this.resetCreateVariants();
        this.activeProduct = this.inventoryItemBlank;
        this.activeProduct$.next(this.activeProduct);
    }
    addDeletedOption(productOption) {
        this._deleteOptions.push(productOption);
    }
    addDeletedOptionGroup(optionGroup) {
        this._deletedOptionGroups.push(optionGroup);
    }
    resetDeletedOptions() {
        this._deleteOptions = [];
        this.deleteOptions$.next(this._deleteOptions);
    }
    resetCreateVariants() {
        this.variantCreateInputs = [];
        this.variantCreateInputs$.next(this.variantCreateInputs);
    }
    get inventoryItemBlank() {
        return {
            tags: [],
            name: '',
            code: '',
            imageUrl: '',
            productTypeId: null,
            productCategoryId: null,
            enabled: true,
            description: '',
            languageCode: this.translateService.currentLang,
            variants: [],
            options: [],
            optionGroups: [],
            featuredImage: null,
            gallery: [],
            id: null
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InventoryStore, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InventoryStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InventoryStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=inventory-store.service.js.map