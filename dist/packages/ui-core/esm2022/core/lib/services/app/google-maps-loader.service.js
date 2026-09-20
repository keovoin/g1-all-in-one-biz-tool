import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class GoogleMapsLoaderService {
    /**
     * Loads the Google Maps API.
     * @param apiKey The Google Maps API key.
     * @returns A promise that resolves when the API is loaded.
     */
    load(apiKey) {
        const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing&callback=__onGoogleLoaded`;
        return new Promise((resolve, reject) => {
            // Prevent loading multiple times
            if (document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`)) {
                resolve('google maps api already loaded');
                return;
            }
            window['__onGoogleLoaded'] = () => {
                window['__onGoogleLoaded'] = undefined;
                resolve('google maps api loaded');
            };
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.type = 'text/javascript';
            script.onerror = (err) => {
                window['__onGoogleLoaded'] = undefined;
                document.head.removeChild(script);
                reject(new Error('Failed to load Google Maps API'));
            };
            document.head.appendChild(script);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoogleMapsLoaderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoogleMapsLoaderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoogleMapsLoaderService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=google-maps-loader.service.js.map