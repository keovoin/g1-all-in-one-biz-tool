import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule } from '@nebular/auth';
import { environment } from '@gauzy/ui-config';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';
import { AuthService, AuthStrategy, ElectronService, Store } from '../services';
import * as i0 from "@angular/core";
/**
 * Social links for auth
 */
const socialLinks = [
    {
        url: environment.GOOGLE_AUTH_LINK,
        icon: 'google-outline'
    },
    {
        url: environment.LINKEDIN_AUTH_LINK,
        icon: 'linkedin-outline'
    },
    {
        url: environment.GITHUB_AUTH_LINK,
        target: '_blank',
        icon: 'github-outline'
    },
    {
        url: environment.TWITTER_AUTH_LINK,
        target: '_blank',
        icon: 'twitter-outline'
    },
    {
        url: environment.FACEBOOK_AUTH_LINK,
        target: '_blank',
        icon: 'facebook-outline'
    },
    {
        url: environment.MICROSOFT_AUTH_LINK,
        target: '_blank',
        icon: 'microsoft'
    }
];
export class AuthModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: AuthModule, imports: [CommonModule, NbAuthModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthModule, providers: [
            ...NbAuthModule.forRoot({
                strategies: [AuthStrategy.setup({ name: 'email' })],
                forms: {
                    login: { socialLinks },
                    register: { socialLinks }
                }
            }).providers,
            AuthGuard,
            NoAuthGuard,
            AuthStrategy,
            AuthService,
            Store,
            ElectronService
        ], imports: [CommonModule, NbAuthModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbAuthModule],
                    providers: [
                        ...NbAuthModule.forRoot({
                            strategies: [AuthStrategy.setup({ name: 'email' })],
                            forms: {
                                login: { socialLinks },
                                register: { socialLinks }
                            }
                        }).providers,
                        AuthGuard,
                        NoAuthGuard,
                        AuthStrategy,
                        AuthService,
                        Store,
                        ElectronService
                    ]
                }]
        }] });
//# sourceMappingURL=auth.module.js.map