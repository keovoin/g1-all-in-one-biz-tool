"use strict";
var JobSearchPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const core_1 = require("@gauzy/core");
const plugin_1 = require("@gauzy/plugin");
const employee_job_module_1 = require("./employee-job/employee-job.module");
const employee_job_preset_module_1 = require("./employee-job-preset/employee-job-preset.module");
const job_preset_entity_1 = require("./employee-job-preset/job-preset.entity");
const job_seeder_service_1 = require("./employee-job-preset/job-seeder.service");
let JobSearchPlugin = JobSearchPlugin_1 = class JobSearchPlugin {
    constructor(jobSeederService) {
        this.jobSeederService = jobSeederService;
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${JobSearchPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${JobSearchPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Seed default data for the plugin.
     */
    async onPluginDefaultSeed() {
        try {
            await this.jobSeederService.seedDefaultJobsData();
            if (this.logEnabled) {
                console.log(chalk.green(`Default data seeded successfully for ${JobSearchPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Error seeding default data for ${JobSearchPlugin_1.name}:`, error));
        }
    }
    /**
     * Seed random data for the plugin.
     */
    async onPluginRandomSeed() {
        try {
            // Add your random data seeding logic here
            if (this.logEnabled) {
                console.log(chalk.green(`Random data seeded successfully for ${JobSearchPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Error seeding random data for ${JobSearchPlugin_1.name}:`, error));
        }
    }
};
exports.JobSearchPlugin = JobSearchPlugin;
exports.JobSearchPlugin = JobSearchPlugin = JobSearchPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [employee_job_module_1.EmployeeJobPostModule, employee_job_preset_module_1.EmployeeJobPresetModule, core_1.SeederModule],
        entities: [...employee_job_preset_module_1.entities],
        configuration: (config) => {
            // Configuration object for custom fields in the Employee entity.
            config.customFields.Employee.push({
                name: 'jobPresets',
                type: 'relation',
                relationType: 'many-to-many',
                pivotTable: 'employee_job_preset',
                joinColumn: 'jobPresetId',
                inverseJoinColumn: 'employeeId',
                entity: job_preset_entity_1.JobPreset,
                inverseSide: (it) => it.employees
            });
            return config;
        },
        providers: [job_seeder_service_1.JobSeederService]
    }),
    tslib_1.__metadata("design:paramtypes", [job_seeder_service_1.JobSeederService])
], JobSearchPlugin);
//# sourceMappingURL=job-search.plugin.js.map