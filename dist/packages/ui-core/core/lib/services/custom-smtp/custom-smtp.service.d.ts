import { HttpClient } from '@angular/common/http';
import { ICustomSmtp, ICustomSmtpFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CustomSmtpService {
    private http;
    API_URL: string;
    constructor(http: HttpClient);
    saveSMTPSetting(request: ICustomSmtp): Promise<ICustomSmtp>;
    updateSMTPSetting(id: any, request: ICustomSmtp): Promise<ICustomSmtp>;
    getSMTPSetting(request: ICustomSmtpFindInput): Promise<ICustomSmtp>;
    validateSMTPSetting(request: ICustomSmtp): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomSmtpService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomSmtpService>;
}
