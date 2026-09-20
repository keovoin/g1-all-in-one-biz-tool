import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ElectronService {
    /**
     * Checks if the application is running in the Electron environment.
     */
    get isElectron() {
        return !!(window && window.process && window.process.type);
    }
    get isContextBridge() {
        return !!(window && window.electronAPI);
    }
    constructor() {
        // Conditional imports
        if (this.isElectron) {
            this.ipcRenderer = window['require']('electron').ipcRenderer;
            this.remote = window['require']('@electron/remote');
            this.shell = window['require']('electron').shell;
        }
        else if (this.isContextBridge) {
            const electronAPI = window.electronAPI;
            this.ipcRenderer = electronAPI.ipcRenderer;
            this.remote = electronAPI.remote;
            this.shell = electronAPI.shell;
        }
        this.desktopCapturer = {
            getSources: async (opts) => await this.ipcRenderer?.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts),
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ElectronService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ElectronService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ElectronService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=electron.service.js.map