import { __decorate, __metadata } from "tslib";
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { catchError, distinctUntilChanged, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
import { PermissionsEnum } from '@gauzy/contracts';
import { environment } from '@gauzy/ui-config';
import { ErrorHandlingService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EverAsyncService } from '../../services/ever-async.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
let EverAsyncConnectComponent = class EverAsyncConnectComponent extends TranslationBaseComponent {
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
        this.organizationEpoch = 0;
        this.store = inject(Store);
        this.service = inject(EverAsyncService);
        this.location = inject(Location);
        this.errors = inject(ErrorHandlingService);
        this.toastr = inject(ToastrService);
        this.organization = signal(null, ...(ngDevMode ? [{ debugName: "organization" }] : []));
        this.loading = signal(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        this.verifying = signal(false, ...(ngDevMode ? [{ debugName: "verifying" }] : []));
        this.connectionOk = signal(null, ...(ngDevMode ? [{ debugName: "connectionOk" }] : []));
        this.settings = signal(null, ...(ngDevMode ? [{ debugName: "settings" }] : []));
        this.credentials = signal(null, ...(ngDevMode ? [{ debugName: "credentials" }] : []));
        this.options = signal({ employees: [], projects: [] }, ...(ngDevMode ? [{ debugName: "options" }] : []));
        this.showSecret = signal(false, ...(ngDevMode ? [{ debugName: "showSecret" }] : []));
        this.ready = signal(false, ...(ngDevMode ? [{ debugName: "ready" }] : []));
        this.form = new FormGroup({
            serverUrl: new FormControl('https://api-async.ever.co', {
                nonNullable: true,
                validators: [Validators.required, Validators.pattern(/^https:\/\/[^\s]+$/)]
            }),
            projectIds: new FormControl([], { nonNullable: true }),
            isEnabled: new FormControl(true, { nonNullable: true }),
            userMappings: new FormArray([])
        });
    }
    get canSave() {
        return this.store.hasPermission(this.settings() ? PermissionsEnum.INTEGRATION_EDIT : PermissionsEnum.INTEGRATION_ADD);
    }
    get canRotate() {
        return this.store.hasPermission(PermissionsEnum.INTEGRATION_EDIT);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChanged((a, b) => a?.id === b?.id), tap((org) => {
            this.organizationEpoch++;
            this.organization.set(org ?? null);
            this.settings.set(null);
            this.credentials.set(null);
            this.options.set({ employees: [], projects: [] });
            this.ready.set(false);
            this.loading.set(false);
            this.verifying.set(false);
            this.connectionOk.set(null);
            this.showSecret.set(false);
            this.form.reset({ serverUrl: 'https://api-async.ever.co', projectIds: [], isEnabled: true });
            this.form.controls.userMappings.clear();
        }), switchMap((org) => org?.id
            ? forkJoin({
                options: this.service.getOptions(org.id),
                settings: this.service
                    .getSettings(org.id)
                    .pipe(catchError((error) => error.status === 404 ? of(null) : throwError(() => error)))
            }).pipe(catchError((error) => {
                this.errors.handleError(error);
                return of(null);
            }))
            : of(null)), untilDestroyed(this))
            .subscribe((result) => {
            if (!result)
                return;
            this.options.set(result.options);
            this.settings.set(result.settings);
            this.ready.set(true);
            if (result.settings) {
                this.form.patchValue(result.settings);
                for (const mapping of result.settings.userMappings)
                    this.addMapping(mapping);
            }
        });
        this.form.controls.serverUrl.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => this.connectionOk.set(null));
    }
    goBack() {
        this.location.back();
    }
    addMapping(mapping) {
        this.form.controls.userMappings.push(new FormGroup({
            channel: new FormControl(mapping?.channel ?? 'slack', {
                nonNullable: true,
                validators: [Validators.required]
            }),
            workspace: new FormControl(mapping?.workspace ?? '', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(200), Validators.pattern(/^\S+$/)]
            }),
            chatUserId: new FormControl(mapping?.chatUserId ?? '', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(200), Validators.pattern(/^\S+$/)]
            }),
            employeeId: new FormControl(mapping?.employeeId ?? '', {
                nonNullable: true,
                validators: [Validators.required]
            })
        }));
    }
    removeMapping(index) {
        this.form.controls.userMappings.removeAt(index);
    }
    toggleProject(id) {
        const ids = this.form.controls.projectIds.value;
        this.form.controls.projectIds.setValue(ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
    }
    testConnection() {
        const epoch = this.organizationEpoch;
        const serverUrl = this.form.controls.serverUrl.value.trim();
        if (this.verifying() || this.form.controls.serverUrl.invalid) {
            this.form.controls.serverUrl.markAsTouched();
            return;
        }
        this.verifying.set(true);
        this.connectionOk.set(null);
        this.service
            .verify(serverUrl)
            .pipe(untilDestroyed(this))
            .subscribe({
            next: (result) => {
                if (this.organizationEpoch !== epoch)
                    return;
                this.verifying.set(false);
                if (this.form.controls.serverUrl.value.trim() === serverUrl)
                    this.connectionOk.set(result.ok);
            },
            error: (error) => {
                if (this.organizationEpoch !== epoch)
                    return;
                this.verifying.set(false);
                if (this.form.controls.serverUrl.value.trim() !== serverUrl)
                    return;
                this.connectionOk.set(false);
                this.errors.handleError(error);
            }
        });
    }
    connect() {
        const organizationId = this.organization()?.id;
        const epoch = this.organizationEpoch;
        if (!organizationId || !this.ready() || this.loading() || !this.canSave)
            return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const dto = this.form.getRawValue();
        dto.serverUrl = dto.serverUrl.trim();
        this.loading.set(true);
        if (this.settings()) {
            this.service
                .updateSettings(dto, organizationId)
                .pipe(untilDestroyed(this))
                .subscribe({
                next: () => {
                    if (this.organizationEpoch !== epoch)
                        return;
                    this.loading.set(false);
                    this.settings.update((value) => (value ? { ...value, ...dto } : value));
                    this.saved();
                },
                error: (error) => this.failed(error, epoch)
            });
        }
        else {
            this.service
                .setup(dto, organizationId)
                .pipe(untilDestroyed(this))
                .subscribe({
                next: (result) => {
                    if (this.organizationEpoch !== epoch)
                        return;
                    this.loading.set(false);
                    this.credentials.set(result);
                    this.settings.set({
                        ...dto,
                        integrationTenantId: result.integrationTenantId,
                        tenantId: result.tenantId,
                        organizationId: result.organizationId,
                        hasApiKey: true
                    });
                    this.saved();
                },
                error: (error) => this.failed(error, epoch)
            });
        }
    }
    rotateCredentials() {
        const organizationId = this.organization()?.id;
        const epoch = this.organizationEpoch;
        if (!organizationId || !this.canRotate || this.loading())
            return;
        this.loading.set(true);
        this.credentials.set(null);
        this.showSecret.set(false);
        this.service
            .rotateCredentials(organizationId)
            .pipe(untilDestroyed(this))
            .subscribe({
            next: (result) => {
                if (this.organizationEpoch !== epoch)
                    return;
                this.loading.set(false);
                this.credentials.set(result);
            },
            error: (error) => this.failed(error, epoch)
        });
    }
    saved() {
        this.toastr.success(this.getTranslation('INTEGRATIONS.EVER_ASYNC_PAGE.SAVED'));
    }
    failed(error, epoch) {
        if (this.organizationEpoch !== epoch)
            return;
        this.loading.set(false);
        this.errors.handleError(error);
    }
    get gauzyApiUrl() {
        // Match the API interceptor's configured base. The Async connector adds
        // /api itself; this value is the deployment base, not an endpoint URL.
        return new URL(environment.API_BASE_URL || window.location.origin, window.location.origin)
            .toString()
            .replace(/\/+$/, '');
    }
    get connectorConfig() {
        const settings = this.settings();
        if (!settings)
            return '';
        const apiUrl = this.gauzyApiUrl;
        return `[connectors.gauzy]\nbase_url = ${JSON.stringify(apiUrl)}\napp_base_url = ${JSON.stringify(window.location.origin)}\nintegration_id = ${JSON.stringify(settings.integrationTenantId)}\ntenant_id = ${JSON.stringify(settings.tenantId)}\norganization_id = ${JSON.stringify(settings.organizationId)}\napi_key_env = "GAUZY_ASYNC_API_KEY"\napi_secret_env = "GAUZY_ASYNC_API_SECRET"\nasync_tenant_id = "YOUR_ASYNC_TENANT"\nchannel = "slack"\nworkspace = "YOUR_CHAT_WORKSPACE"`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EverAsyncConnectComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EverAsyncConnectComponent, isStandalone: false, selector: "ngx-ever-async-connect", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"d-flex align-items-center\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\ttype=\"button\"\n\t\t\tsize=\"small\"\n\t\t\t(click)=\"goBack()\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.BACK' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<h5 class=\"ml-4\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TITLE' | translate }}</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SETUP_INFO' | translate }}</p>\n\t\t@if (!ready()) {\n\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELECT_ORGANIZATION' | translate }}</p>\n\t\t}\n\t\t@if (ready()) {\n\t\t\t<form [formGroup]=\"form\" (ngSubmit)=\"connect()\">\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-url\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.SERVER_URL' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"ever-async-url\"\n\t\t\t\t\t\ttype=\"url\"\n\t\t\t\t\t\tformControlName=\"serverUrl\"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\taria-describedby=\"ever-async-url-hint\"\n\t\t\t\t\t/>\n\t\t\t\t\t<p id=\"ever-async-url-hint\" class=\"hint\">\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.URL_HINT' | translate }}\n\t\t\t\t\t</p>\n\t\t\t\t\t@if (form.controls.serverUrl.invalid && form.controls.serverUrl.touched) {\n\t\t\t\t\t\t<p role=\"alert\" class=\"text-danger\">\n\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.URL_INVALID' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t}\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[disabled]=\"verifying() || form.controls.serverUrl.invalid\"\n\t\t\t\t\t\t(click)=\"testConnection()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TEST_CONNECTION' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t@if (connectionOk() === true) {\n\t\t\t\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECTION_OK' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t\t@if (connectionOk() === false) {\n\t\t\t\t\t\t<p role=\"alert\" class=\"text-danger\">\n\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECTION_FAILED' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<fieldset>\n\t\t\t\t\t<legend>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.PROJECTS' | translate }}</legend>\n\t\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.PROJECTS_HINT' | translate }}</p>\n\t\t\t\t\t@for (project of options().projects; track project.id) {\n\t\t\t\t\t\t<label class=\"project-option\"\n\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\ttype=\"checkbox\"\n\t\t\t\t\t\t\t\t[checked]=\"form.controls.projectIds.value.includes(project.id)\"\n\t\t\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t\t\t(change)=\"toggleProject(project.id)\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t{{ project.name }}</label\n\t\t\t\t\t\t>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<p>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.NO_PROJECTS' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</fieldset>\n\t\t\t\t<fieldset formArrayName=\"userMappings\">\n\t\t\t\t\t<legend>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.MAPPINGS' | translate }}</legend>\n\t\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.MAPPINGS_HINT' | translate }}</p>\n\t\t\t\t\t@for (mapping of form.controls.userMappings.controls; track mapping; let i = $index) {\n\t\t\t\t\t\t<div class=\"mapping-row\" [formGroupName]=\"i\">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-platform-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_PLATFORM' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><select [id]=\"'chat-platform-' + i\" formControlName=\"channel\">\n\t\t\t\t\t\t\t\t\t<option value=\"slack\">Slack</option>\n\t\t\t\t\t\t\t\t\t<option value=\"discord\">Discord</option>\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-workspace-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_WORKSPACE' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[id]=\"'chat-workspace-' + i\"\n\t\t\t\t\t\t\t\t\tformControlName=\"workspace\"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tmaxlength=\"200\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-user-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_USER' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[id]=\"'chat-user-' + i\"\n\t\t\t\t\t\t\t\t\tformControlName=\"chatUserId\"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tmaxlength=\"200\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'employee-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.EMPLOYEE' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><select [id]=\"'employee-' + i\" formControlName=\"employeeId\" required>\n\t\t\t\t\t\t\t\t\t<option value=\"\">\n\t\t\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELECT_EMPLOYEE' | translate }}\n\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t@for (employee of options().employees; track employee.id) {\n\t\t\t\t\t\t\t\t\t\t<option [value]=\"employee.id\">{{ employee.name }}</option>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t\t\t(click)=\"removeMapping(i)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.REMOVE_MAPPING' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t(click)=\"addMapping()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ADD_MAPPING' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</fieldset>\n\t\t\t\t@if (settings()) {\n\t\t\t\t\t<label class=\"project-option\"\n\t\t\t\t\t\t><input type=\"checkbox\" formControlName=\"isEnabled\" />\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ENABLED' | translate }}</label\n\t\t\t\t\t>\n\t\t\t\t}\n\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t<button nbButton status=\"primary\" type=\"submit\" [disabled]=\"!canSave || form.invalid || loading()\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t(settings() ? 'INTEGRATIONS.EVER_ASYNC_PAGE.SAVE' : 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECT')\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t}}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t}\n\t\t@if (settings()) {\n\t\t\t<section class=\"connection-config\">\n\t\t\t\t<h6>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURE_CONNECTOR' | translate }}</h6>\n\t\t\t\t<p>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURE_HINT' | translate }}</p>\n\t\t\t\t<dl class=\"pairing-details\">\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.GAUZY_API_URL' | translate }}</dt>\n\t\t\t\t\t<dd>{{ gauzyApiUrl }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.INTEGRATION_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.integrationTenantId }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TENANT_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.tenantId }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ORGANIZATION_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.organizationId }}</dd>\n\t\t\t\t</dl>\n\t\t\t\t<details>\n\t\t\t\t\t<summary>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELF_HOSTED_CONFIG' | translate }}</summary>\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-config\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURATION' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\treadonly\n\t\t\t\t\t\tid=\"ever-async-config\"\n\t\t\t\t\t\trows=\"13\"\n\t\t\t\t\t\t[value]=\"connectorConfig\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</details>\n\t\t\t\t@if (credentials(); as key) {\n\t\t\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SECRET_ONCE' | translate }}</p>\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-key\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.API_KEY' | translate\n\t\t\t\t\t}}</label\n\t\t\t\t\t><input nbInput fullWidth readonly id=\"ever-async-key\" [value]=\"key.apiKey\" autocomplete=\"off\" />\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-secret\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.API_SECRET' | translate\n\t\t\t\t\t}}</label\n\t\t\t\t\t><input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\treadonly\n\t\t\t\t\t\tid=\"ever-async-secret\"\n\t\t\t\t\t\t[type]=\"showSecret() ? 'text' : 'password'\"\n\t\t\t\t\t\t[value]=\"key.apiSecret\"\n\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton type=\"button\" status=\"basic\" size=\"small\" (click)=\"showSecret.set(!showSecret())\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t(showSecret()\n\t\t\t\t\t\t\t\t? 'INTEGRATIONS.EVER_ASYNC_PAGE.HIDE_SECRET'\n\t\t\t\t\t\t\t\t: 'INTEGRATIONS.EVER_ASYNC_PAGE.SHOW_SECRET'\n\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t}}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ROTATE_HINT' | translate }}</p>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[disabled]=\"!canRotate || loading()\"\n\t\t\t\t\t(click)=\"rotateCredentials()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ROTATE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<p>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref=\"https://docs-async.ever.co/connectors/ever-gauzy/\"\n\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SETUP_GUIDE' | translate }}</a\n\t\t\t\t\t>\n\t\t\t\t</p>\n\t\t\t</section>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block}form,.connection-config{max-width:64rem}.hint{margin:.75rem 0;color:var(--text-hint-color)}fieldset,.connection-config{margin:1.5rem 0;padding:1rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius)}legend{width:auto;font-size:1rem;padding:0 .4rem}.mapping-row{display:grid;grid-template-columns:.7fr 1fr 1fr 1fr auto;align-items:end;gap:.75rem;margin-bottom:1rem}.project-option{display:flex;align-items:center;gap:.6rem;margin:.75rem 0}select{width:100%;min-height:2.7rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);color:var(--text-basic-color);background:var(--background-basic-color-1);padding:.5rem}.actions{display:flex;gap:.75rem;margin-top:1rem}.connection-config label{display:block;margin-top:.75rem}.connection-config button{margin-top:.75rem}textarea{font-family:monospace;resize:vertical}.pairing-details dd{overflow-wrap:anywhere}@media(max-width:1100px){.mapping-row{grid-template-columns:1fr 1fr}}@media(max-width:640px){.mapping-row{grid-template-columns:1fr}}\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i2.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i2.FormGroupName, selector: "[formGroupName]", inputs: ["formGroupName"] }, { kind: "directive", type: i2.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i3.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i3.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
EverAsyncConnectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService])
], EverAsyncConnectComponent);
export { EverAsyncConnectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EverAsyncConnectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-ever-async-connect', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"d-flex align-items-center\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\ttype=\"button\"\n\t\t\tsize=\"small\"\n\t\t\t(click)=\"goBack()\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.BACK' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<h5 class=\"ml-4\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TITLE' | translate }}</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SETUP_INFO' | translate }}</p>\n\t\t@if (!ready()) {\n\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELECT_ORGANIZATION' | translate }}</p>\n\t\t}\n\t\t@if (ready()) {\n\t\t\t<form [formGroup]=\"form\" (ngSubmit)=\"connect()\">\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-url\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.SERVER_URL' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"ever-async-url\"\n\t\t\t\t\t\ttype=\"url\"\n\t\t\t\t\t\tformControlName=\"serverUrl\"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\taria-describedby=\"ever-async-url-hint\"\n\t\t\t\t\t/>\n\t\t\t\t\t<p id=\"ever-async-url-hint\" class=\"hint\">\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.URL_HINT' | translate }}\n\t\t\t\t\t</p>\n\t\t\t\t\t@if (form.controls.serverUrl.invalid && form.controls.serverUrl.touched) {\n\t\t\t\t\t\t<p role=\"alert\" class=\"text-danger\">\n\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.URL_INVALID' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t}\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[disabled]=\"verifying() || form.controls.serverUrl.invalid\"\n\t\t\t\t\t\t(click)=\"testConnection()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TEST_CONNECTION' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t@if (connectionOk() === true) {\n\t\t\t\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECTION_OK' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t\t@if (connectionOk() === false) {\n\t\t\t\t\t\t<p role=\"alert\" class=\"text-danger\">\n\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECTION_FAILED' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<fieldset>\n\t\t\t\t\t<legend>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.PROJECTS' | translate }}</legend>\n\t\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.PROJECTS_HINT' | translate }}</p>\n\t\t\t\t\t@for (project of options().projects; track project.id) {\n\t\t\t\t\t\t<label class=\"project-option\"\n\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\ttype=\"checkbox\"\n\t\t\t\t\t\t\t\t[checked]=\"form.controls.projectIds.value.includes(project.id)\"\n\t\t\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t\t\t(change)=\"toggleProject(project.id)\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t{{ project.name }}</label\n\t\t\t\t\t\t>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<p>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.NO_PROJECTS' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</fieldset>\n\t\t\t\t<fieldset formArrayName=\"userMappings\">\n\t\t\t\t\t<legend>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.MAPPINGS' | translate }}</legend>\n\t\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.MAPPINGS_HINT' | translate }}</p>\n\t\t\t\t\t@for (mapping of form.controls.userMappings.controls; track mapping; let i = $index) {\n\t\t\t\t\t\t<div class=\"mapping-row\" [formGroupName]=\"i\">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-platform-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_PLATFORM' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><select [id]=\"'chat-platform-' + i\" formControlName=\"channel\">\n\t\t\t\t\t\t\t\t\t<option value=\"slack\">Slack</option>\n\t\t\t\t\t\t\t\t\t<option value=\"discord\">Discord</option>\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-workspace-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_WORKSPACE' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[id]=\"'chat-workspace-' + i\"\n\t\t\t\t\t\t\t\t\tformControlName=\"workspace\"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tmaxlength=\"200\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'chat-user-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CHAT_USER' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[id]=\"'chat-user-' + i\"\n\t\t\t\t\t\t\t\t\tformControlName=\"chatUserId\"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tmaxlength=\"200\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'employee-' + i\">{{\n\t\t\t\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.EMPLOYEE' | translate\n\t\t\t\t\t\t\t\t}}</label\n\t\t\t\t\t\t\t\t><select [id]=\"'employee-' + i\" formControlName=\"employeeId\" required>\n\t\t\t\t\t\t\t\t\t<option value=\"\">\n\t\t\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELECT_EMPLOYEE' | translate }}\n\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t@for (employee of options().employees; track employee.id) {\n\t\t\t\t\t\t\t\t\t\t<option [value]=\"employee.id\">{{ employee.name }}</option>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t\t\t(click)=\"removeMapping(i)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.REMOVE_MAPPING' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[disabled]=\"!canSave || loading()\"\n\t\t\t\t\t\t(click)=\"addMapping()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ADD_MAPPING' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</fieldset>\n\t\t\t\t@if (settings()) {\n\t\t\t\t\t<label class=\"project-option\"\n\t\t\t\t\t\t><input type=\"checkbox\" formControlName=\"isEnabled\" />\n\t\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ENABLED' | translate }}</label\n\t\t\t\t\t>\n\t\t\t\t}\n\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t<button nbButton status=\"primary\" type=\"submit\" [disabled]=\"!canSave || form.invalid || loading()\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t(settings() ? 'INTEGRATIONS.EVER_ASYNC_PAGE.SAVE' : 'INTEGRATIONS.EVER_ASYNC_PAGE.CONNECT')\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t}}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t}\n\t\t@if (settings()) {\n\t\t\t<section class=\"connection-config\">\n\t\t\t\t<h6>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURE_CONNECTOR' | translate }}</h6>\n\t\t\t\t<p>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURE_HINT' | translate }}</p>\n\t\t\t\t<dl class=\"pairing-details\">\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.GAUZY_API_URL' | translate }}</dt>\n\t\t\t\t\t<dd>{{ gauzyApiUrl }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.INTEGRATION_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.integrationTenantId }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.TENANT_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.tenantId }}</dd>\n\t\t\t\t\t<dt>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ORGANIZATION_ID' | translate }}</dt>\n\t\t\t\t\t<dd>{{ settings()?.organizationId }}</dd>\n\t\t\t\t</dl>\n\t\t\t\t<details>\n\t\t\t\t\t<summary>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SELF_HOSTED_CONFIG' | translate }}</summary>\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-config\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.CONFIGURATION' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\treadonly\n\t\t\t\t\t\tid=\"ever-async-config\"\n\t\t\t\t\t\trows=\"13\"\n\t\t\t\t\t\t[value]=\"connectorConfig\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</details>\n\t\t\t\t@if (credentials(); as key) {\n\t\t\t\t\t<p role=\"status\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SECRET_ONCE' | translate }}</p>\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-key\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.API_KEY' | translate\n\t\t\t\t\t}}</label\n\t\t\t\t\t><input nbInput fullWidth readonly id=\"ever-async-key\" [value]=\"key.apiKey\" autocomplete=\"off\" />\n\t\t\t\t\t<label class=\"label\" for=\"ever-async-secret\">{{\n\t\t\t\t\t\t'INTEGRATIONS.EVER_ASYNC_PAGE.API_SECRET' | translate\n\t\t\t\t\t}}</label\n\t\t\t\t\t><input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\treadonly\n\t\t\t\t\t\tid=\"ever-async-secret\"\n\t\t\t\t\t\t[type]=\"showSecret() ? 'text' : 'password'\"\n\t\t\t\t\t\t[value]=\"key.apiSecret\"\n\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton type=\"button\" status=\"basic\" size=\"small\" (click)=\"showSecret.set(!showSecret())\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t(showSecret()\n\t\t\t\t\t\t\t\t? 'INTEGRATIONS.EVER_ASYNC_PAGE.HIDE_SECRET'\n\t\t\t\t\t\t\t\t: 'INTEGRATIONS.EVER_ASYNC_PAGE.SHOW_SECRET'\n\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t}}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t\t<p class=\"hint\">{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ROTATE_HINT' | translate }}</p>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[disabled]=\"!canRotate || loading()\"\n\t\t\t\t\t(click)=\"rotateCredentials()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.ROTATE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<p>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref=\"https://docs-async.ever.co/connectors/ever-gauzy/\"\n\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t>{{ 'INTEGRATIONS.EVER_ASYNC_PAGE.SETUP_GUIDE' | translate }}</a\n\t\t\t\t\t>\n\t\t\t\t</p>\n\t\t\t</section>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block}form,.connection-config{max-width:64rem}.hint{margin:.75rem 0;color:var(--text-hint-color)}fieldset,.connection-config{margin:1.5rem 0;padding:1rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius)}legend{width:auto;font-size:1rem;padding:0 .4rem}.mapping-row{display:grid;grid-template-columns:.7fr 1fr 1fr 1fr auto;align-items:end;gap:.75rem;margin-bottom:1rem}.project-option{display:flex;align-items:center;gap:.6rem;margin:.75rem 0}select{width:100%;min-height:2.7rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);color:var(--text-basic-color);background:var(--background-basic-color-1);padding:.5rem}.actions{display:flex;gap:.75rem;margin-top:1rem}.connection-config label{display:block;margin-top:.75rem}.connection-config button{margin-top:.75rem}textarea{font-family:monospace;resize:vertical}.pairing-details dd{overflow-wrap:anywhere}@media(max-width:1100px){.mapping-row{grid-template-columns:1fr 1fr}}@media(max-width:640px){.mapping-row{grid-template-columns:1fr}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=ever-async-connect.component.js.map