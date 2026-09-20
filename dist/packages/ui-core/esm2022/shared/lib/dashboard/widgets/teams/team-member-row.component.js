import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NbBadgeModule, NbProgressBarModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { progressStatus } from '@gauzy/ui-core/common';
import { ComponentsModule } from '../../../components/components.module';
import { DurationFormatPipe } from '../../../pipes/duration-format.pipe';
import { toPercentage } from './teams-widget.utils';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../../components/avatar/avatar.component";
import * as i3 from "@ngx-translate/core";
/**
 * The compact member row of the Teams dashboard: status dot, avatar, how much of
 * the working day is logged, and the activity badge.
 *
 * Extracted from `gauzy-team-member` in its "classic" mode, and shared by every
 * Teams widget that lists people — the flat member list and the per-team overview
 * both render this exact row, so the chrome cannot drift between them.
 *
 * Purely presentational: it fetches nothing and owns no state.
 */
export class TeamMemberRowComponent {
    constructor() {
        /** The member to render. */
        this.member = input.required(...(ngDevMode ? [{ debugName: "member" }] : []));
        /**
         * Whether to print the member's team under their name.
         *
         * Only useful in a FLAT list spanning several teams; inside a per-team card it
         * would repeat the card's own heading on every row.
         */
        this.showTeamName = input(false, ...(ngDevMode ? [{ debugName: "showTeamName" }] : []));
    }
    /**
     * Share of the member's working day that is already logged.
     *
     * @returns A percentage between 0 and 100.
     */
    workedPercentage() {
        const member = this.member();
        return toPercentage(member.workedDuration, member.workPeriod);
    }
    /**
     * Nebular status for a percentage, so the progress bars and activity badges
     * use the same danger/warning/info/success scale as the rest of the app.
     *
     * Accepts `null` because a member's activity legitimately has none — the
     * template guards the BADGE on that, but Angular does not narrow a
     * `member().activity` call expression across the surrounding `@if`.
     *
     * @param value - A percentage between 0 and 100, or `null`.
     * @returns The matching Nebular status name.
     */
    statusFor(value) {
        return progressStatus(value ?? 0);
    }
    /**
     * Rounded activity percentage rendered inside the member's badge.
     *
     * Formatted here rather than through the decimal pipe so the row does not have
     * to pull `CommonModule` in just for one number.
     *
     * @returns The percentage, e.g. `"64%"`.
     */
    activityLabel() {
        return `${Math.round(this.member().activity ?? 0)}%`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMemberRowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamMemberRowComponent, isStandalone: true, selector: "ga-team-member-row", inputs: { member: { classPropertyName: "member", publicName: "member", isSignal: true, isRequired: true, transformFunction: null }, showTeamName: { classPropertyName: "showTeamName", publicName: "showTeamName", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"member-row\">\n\t<span\n\t\tclass=\"member-dot\"\n\t\t[class.online]=\"member().isRunningTimer\"\n\t\t[class.offline]=\"!member().isWorkingToday\"\n\t\t[attr.aria-hidden]=\"true\"\n\t></span>\n\n\t<div class=\"member-identity\">\n\t\t<ngx-avatar\n\t\t\tclass=\"avatar-dashboard\"\n\t\t\t[id]=\"member().employee?.id\"\n\t\t\t[name]=\"member().name\"\n\t\t\t[src]=\"member().imageUrl\"\n\t\t\t[employee]=\"member().employee\"\n\t\t></ngx-avatar>\n\t\t@if (showTeamName()) {\n\t\t\t<div class=\"member-team\" [title]=\"member().teamName\">{{ member().teamName }}</div>\n\t\t}\n\t</div>\n\n\t<div class=\"member-progress\">\n\t\t<nb-progress-bar\n\t\t\tsize=\"tiny\"\n\t\t\t[displayValue]=\"false\"\n\t\t\t[status]=\"statusFor(workedPercentage())\"\n\t\t\t[value]=\"workedPercentage()\"\n\t\t></nb-progress-bar>\n\t</div>\n\n\t<div class=\"member-duration\">\n\t\t@if (member().workedDuration > 0) {\n\t\t\t{{ member().workedDuration | durationFormat }}\n\t\t} @else {\n\t\t\t{{ 'ORGANIZATIONS_PAGE.NOT_WORKED' | translate }}\n\t\t}\n\t</div>\n\n\t<div class=\"member-activity\">\n\t\t@if (member().isWorkingToday && member().activity !== null) {\n\t\t\t<nb-badge [status]=\"statusFor(member().activity)\" [text]=\"activityLabel()\"></nb-badge>\n\t\t}\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0;container-type:inline-size}.member-row{display:grid;grid-template-columns:16px minmax(0,1.6fr) minmax(0,1fr) auto auto;align-items:center;gap:.5rem;padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.member-dot{width:12px;height:12px;border-radius:50%;background-color:var(--color-warning-default)}.member-dot.online{background-color:var(--color-success-default)}.member-dot.offline{background-color:var(--color-danger-default)}.member-identity{display:flex;flex-direction:column;gap:.125rem;min-width:0}.member-team{color:var(--text-hint-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.member-duration{color:var(--text-hint-color);font-size:var(--text-caption-font-size);white-space:nowrap}.member-activity nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:10px}@container (max-width: 480px){.member-row{grid-template-columns:16px minmax(0,1fr) auto auto}.member-progress{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ComponentsModule }, { kind: "component", type: i2.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }, { kind: "pipe", type: DurationFormatPipe, name: "durationFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMemberRowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-member-row', standalone: true, imports: [NbBadgeModule, NbProgressBarModule, TranslateModule, ComponentsModule, DurationFormatPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"member-row\">\n\t<span\n\t\tclass=\"member-dot\"\n\t\t[class.online]=\"member().isRunningTimer\"\n\t\t[class.offline]=\"!member().isWorkingToday\"\n\t\t[attr.aria-hidden]=\"true\"\n\t></span>\n\n\t<div class=\"member-identity\">\n\t\t<ngx-avatar\n\t\t\tclass=\"avatar-dashboard\"\n\t\t\t[id]=\"member().employee?.id\"\n\t\t\t[name]=\"member().name\"\n\t\t\t[src]=\"member().imageUrl\"\n\t\t\t[employee]=\"member().employee\"\n\t\t></ngx-avatar>\n\t\t@if (showTeamName()) {\n\t\t\t<div class=\"member-team\" [title]=\"member().teamName\">{{ member().teamName }}</div>\n\t\t}\n\t</div>\n\n\t<div class=\"member-progress\">\n\t\t<nb-progress-bar\n\t\t\tsize=\"tiny\"\n\t\t\t[displayValue]=\"false\"\n\t\t\t[status]=\"statusFor(workedPercentage())\"\n\t\t\t[value]=\"workedPercentage()\"\n\t\t></nb-progress-bar>\n\t</div>\n\n\t<div class=\"member-duration\">\n\t\t@if (member().workedDuration > 0) {\n\t\t\t{{ member().workedDuration | durationFormat }}\n\t\t} @else {\n\t\t\t{{ 'ORGANIZATIONS_PAGE.NOT_WORKED' | translate }}\n\t\t}\n\t</div>\n\n\t<div class=\"member-activity\">\n\t\t@if (member().isWorkingToday && member().activity !== null) {\n\t\t\t<nb-badge [status]=\"statusFor(member().activity)\" [text]=\"activityLabel()\"></nb-badge>\n\t\t}\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0;container-type:inline-size}.member-row{display:grid;grid-template-columns:16px minmax(0,1.6fr) minmax(0,1fr) auto auto;align-items:center;gap:.5rem;padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.member-dot{width:12px;height:12px;border-radius:50%;background-color:var(--color-warning-default)}.member-dot.online{background-color:var(--color-success-default)}.member-dot.offline{background-color:var(--color-danger-default)}.member-identity{display:flex;flex-direction:column;gap:.125rem;min-width:0}.member-team{color:var(--text-hint-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.member-duration{color:var(--text-hint-color);font-size:var(--text-caption-font-size);white-space:nowrap}.member-activity nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:10px}@container (max-width: 480px){.member-row{grid-template-columns:16px minmax(0,1fr) auto auto}.member-progress{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { member: [{ type: i0.Input, args: [{ isSignal: true, alias: "member", required: true }] }], showTeamName: [{ type: i0.Input, args: [{ isSignal: true, alias: "showTeamName", required: false }] }] } });
//# sourceMappingURL=team-member-row.component.js.map