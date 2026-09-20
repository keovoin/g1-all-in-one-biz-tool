import * as i0 from "@angular/core";
export declare class ElectronService {
    ipcRenderer: any;
    remote: any;
    desktopCapturer: any;
    shell: any;
    /**
     * Checks if the application is running in the Electron environment.
     */
    get isElectron(): boolean;
    get isContextBridge(): boolean;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ElectronService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ElectronService>;
}
