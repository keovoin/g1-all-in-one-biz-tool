"use strict";
var EverAsyncIntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncIntegrationService = void 0;
const tslib_1 = require("tslib");
// cspell:ignore sqljs
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const crypto_1 = require("crypto");
const util_1 = require("util");
const typeorm_1 = require("typeorm");
const rxjs_1 = require("rxjs");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const ever_async_setting_enum_1 = require("./ever-async-setting.enum");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
/** Organization-scoped management and a separate, read-only connector boundary. */
let EverAsyncIntegrationService = EverAsyncIntegrationService_1 = class EverAsyncIntegrationService {
    constructor(dataSource, httpService) {
        this.dataSource = dataSource;
        this.httpService = httpService;
        this.httpsAgent = (0, core_1.createSsrfSafeHttpsAgent)();
    }
    /** SQLite shares one connection; queue plugin transactions rather than nesting them. */
    async transaction(work) {
        if (!['sqlite', 'better-sqlite3', 'sqljs'].includes(this.dataSource.options.type)) {
            return this.dataSource.transaction(work);
        }
        const queue = EverAsyncIntegrationService_1.sqliteTransactions;
        const previous = queue.get(this.dataSource) ?? Promise.resolve();
        let release;
        const current = new Promise((resolve) => {
            release = resolve;
        });
        queue.set(this.dataSource, current);
        await previous;
        try {
            return await this.dataSource.transaction(work);
        }
        finally {
            release();
            if (queue.get(this.dataSource) === current)
                queue.delete(this.dataSource);
        }
    }
    async onApplicationBootstrap() {
        await this.ensureCatalog();
    }
    /** Make the plugin discoverable on existing installations as well as fresh seeds. */
    async ensureCatalog() {
        return this.transaction(async (manager) => {
            if (manager.connection.options.type === 'postgres')
                await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['ever-async:catalog']);
            // The unique catalog name makes first startup safe across all supported SQL drivers.
            await manager
                .createQueryBuilder()
                .insert()
                .into(core_1.Integration)
                .values({
                id: (0, crypto_1.randomUUID)(),
                name: contracts_1.IntegrationEnum.EVER_ASYNC,
                provider: contracts_1.IntegrationEnum.EVER_ASYNC,
                imgSrc: 'integrations/ever-async.svg',
                redirectUrl: 'ever-async',
                isComingSoon: false,
                isPaid: false,
                order: 12
            })
                .orIgnore()
                .execute();
            if (['postgres', 'mysql', 'mariadb'].includes(manager.connection.options.type)) {
                await manager.findOneOrFail(core_1.Integration, {
                    where: { name: contracts_1.IntegrationEnum.EVER_ASYNC },
                    lock: { mode: 'pessimistic_write' }
                });
            }
            const integration = await manager.findOneOrFail(core_1.Integration, {
                where: { name: contracts_1.IntegrationEnum.EVER_ASYNC },
                relations: { integrationTypes: true }
            });
            const types = await manager.find(core_1.IntegrationType, {
                where: { name: (0, typeorm_1.In)([contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT]) }
            });
            const missing = types.filter((type) => !integration.integrationTypes?.some((current) => current.id === type.id));
            if (!missing.length)
                return integration;
            integration.integrationTypes = [...(integration.integrationTypes ?? []), ...missing];
            return manager.save(core_1.Integration, integration);
        });
    }
    async scope(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const userId = core_1.RequestContext.currentUserId();
        organizationId ??= core_1.RequestContext.currentOrganizationId() ?? undefined;
        if (!tenantId || !userId || !organizationId || !(0, class_validator_1.isUUID)(organizationId)) {
            throw new common_1.ForbiddenException('An authenticated organization context is required.');
        }
        const membership = await this.dataSource.getRepository(core_1.UserOrganization).findOneBy({
            tenantId,
            organizationId,
            userId,
            isActive: true,
            isArchived: false
        });
        if (!membership)
            throw new common_1.ForbiddenException('Access to this organization is required.');
        return { tenantId, organizationId };
    }
    async find(scope, manager = this.dataSource.manager) {
        return manager.findOne(core_1.IntegrationTenant, {
            where: { ...scope, name: contracts_1.IntegrationEnum.EVER_ASYNC, isActive: true, isArchived: false },
            relations: { settings: true }
        });
    }
    async requireIntegration(organizationId) {
        const scope = await this.scope(organizationId);
        const integration = await this.find(scope);
        if (!integration?.id || !integration.tenantId || !integration.organizationId)
            throw new common_1.NotFoundException('Ever Async is not configured for this organization.');
        return integration;
    }
    settings(integration) {
        return Object.fromEntries((integration.settings ?? []).map((s) => [s.settingsName, s.settingsValue]));
    }
    parseArray(raw) {
        if (!raw)
            return [];
        try {
            const value = JSON.parse(raw);
            return Array.isArray(value) ? value : [];
        }
        catch {
            return [];
        }
    }
    set(integration, values, manager) {
        integration.settings ??= [];
        for (const [settingsName, settingsValue] of Object.entries(values)) {
            const existing = integration.settings.find((s) => s.settingsName === settingsName);
            if (existing)
                existing.settingsValue = settingsValue;
            else
                integration.settings.push(manager.create(core_1.IntegrationSetting, {
                    id: (0, crypto_1.randomUUID)(),
                    tenantId: integration.tenantId,
                    organizationId: integration.organizationId,
                    settingsName,
                    settingsValue
                }));
        }
    }
    async credentials() {
        const apiKey = (0, crypto_1.randomBytes)(16).toString('hex');
        const apiSecret = (0, crypto_1.randomBytes)(32).toString('hex');
        const digest = (await scryptAsync(apiSecret, apiKey, 64)).toString('hex');
        return { apiKey, apiSecret, digest };
    }
    serverUrl(input) {
        const reason = (0, utils_1.getUnsafeOutboundUrlReason)(input);
        if (reason)
            throw new common_1.BadRequestException(`Invalid Ever Async URL: ${reason}`);
        const url = new URL(input);
        if (url.search || url.hash)
            throw new common_1.BadRequestException('Ever Async URL must not contain a query or fragment.');
        return url.toString().replace(/\/+$/, '');
    }
    async validateSelection(dto, scope) {
        if (dto.userMappings !== undefined) {
            const mappings = dto.userMappings;
            if (new Set(mappings.map((m) => JSON.stringify([m.channel, m.workspace, m.chatUserId]))).size !==
                mappings.length) {
                throw new common_1.BadRequestException('Each chat user can have only one employee mapping per channel and workspace.');
            }
            const ids = [...new Set(mappings.map((m) => m.employeeId))];
            if (ids.length &&
                (await this.dataSource
                    .getRepository(core_1.Employee)
                    .countBy({ ...scope, id: (0, typeorm_1.In)(ids), isActive: true, isArchived: false })) !== ids.length) {
                throw new common_1.BadRequestException('Every mapped employee must be active in this organization.');
            }
        }
        if (dto.projectIds !== undefined) {
            const ids = [...new Set(dto.projectIds)];
            if (ids.length &&
                (await this.dataSource
                    .getRepository(core_1.OrganizationProject)
                    .countBy({ ...scope, id: (0, typeorm_1.In)(ids), isActive: true, isArchived: false })) !== ids.length) {
                throw new common_1.BadRequestException('Every selected project must be active in this organization.');
            }
        }
    }
    async setupIntegration(dto, organizationId) {
        const scope = await this.scope(organizationId);
        const serverUrl = this.serverUrl(dto.serverUrl);
        await this.validateSelection(dto, scope);
        const base = await this.ensureCatalog();
        return this.transaction(async (manager) => {
            // Serialize setup even before an IntegrationTenant row exists.
            if (manager.connection.options.type === 'postgres') {
                await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
                    `ever-async:${scope.tenantId}:${scope.organizationId}`
                ]);
            }
            if (['mysql', 'mariadb'].includes(manager.connection.options.type)) {
                await manager.findOneOrFail(core_1.Organization, {
                    where: { id: scope.organizationId, tenantId: scope.tenantId },
                    lock: { mode: 'pessimistic_write' }
                });
            }
            if (await this.find(scope, manager))
                throw new common_1.ConflictException('Ever Async is already configured for this organization.');
            const integration = manager.create(core_1.IntegrationTenant, {
                id: (0, crypto_1.randomUUID)(),
                ...scope,
                name: contracts_1.IntegrationEnum.EVER_ASYNC,
                integrationId: base.id,
                isActive: true,
                isArchived: false
            });
            const key = await this.credentials();
            this.set(integration, {
                [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SERVER_URL]: serverUrl,
                [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_USER_MAPPINGS]: JSON.stringify(dto.userMappings ?? []),
                [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_PROJECT_IDS]: JSON.stringify(dto.projectIds ?? []),
                [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_KEY_ID]: key.apiKey,
                [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SECRET_HASH]: key.digest,
                [ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED]: 'true'
            }, manager);
            await manager.save(core_1.IntegrationTenant, integration);
            return { integrationTenantId: integration.id, ...scope, apiKey: key.apiKey, apiSecret: key.apiSecret };
        });
    }
    async getSettings(organizationId) {
        const integration = await this.requireIntegration(organizationId);
        const settings = this.settings(integration);
        return {
            integrationTenantId: integration.id,
            tenantId: integration.tenantId,
            organizationId: integration.organizationId,
            serverUrl: settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SERVER_URL] ?? '',
            userMappings: this.parseArray(settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_USER_MAPPINGS]),
            projectIds: this.parseArray(settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_PROJECT_IDS]),
            isEnabled: settings[ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED] === 'true',
            hasApiKey: !!settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SECRET_HASH]
        };
    }
    async mutate(organizationId, change) {
        const scope = await this.scope(organizationId);
        return this.transaction(async (manager) => {
            if (['postgres', 'mysql', 'mariadb'].includes(manager.connection.options.type)) {
                await manager.findOne(core_1.IntegrationTenant, {
                    where: { ...scope, name: contracts_1.IntegrationEnum.EVER_ASYNC, isActive: true, isArchived: false },
                    lock: { mode: 'pessimistic_write' }
                });
            }
            const integration = await this.find(scope, manager);
            if (!integration?.id || !integration.tenantId || !integration.organizationId)
                throw new common_1.NotFoundException('Ever Async is not configured for this organization.');
            return change(integration, manager);
        });
    }
    async updateSettings(dto, organizationId) {
        return this.mutate(organizationId, async (integration, manager) => {
            await this.validateSelection(dto, {
                tenantId: integration.tenantId,
                organizationId: integration.organizationId
            });
            const values = {};
            if (dto.serverUrl !== undefined)
                values[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SERVER_URL] = this.serverUrl(dto.serverUrl);
            if (dto.userMappings !== undefined)
                values[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_USER_MAPPINGS] = JSON.stringify(dto.userMappings);
            if (dto.projectIds !== undefined)
                values[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_PROJECT_IDS] = JSON.stringify([...new Set(dto.projectIds)]);
            if (dto.isEnabled !== undefined)
                values[ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED] = String(dto.isEnabled);
            this.set(integration, values, manager);
            await manager.save(core_1.IntegrationTenant, integration);
            return { integrationTenantId: integration.id, updated: true };
        });
    }
    async rotateCredentials(organizationId) {
        return this.mutate(organizationId, async (integration, manager) => {
            const key = await this.credentials();
            this.set(integration, { [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_KEY_ID]: key.apiKey, [ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SECRET_HASH]: key.digest }, manager);
            await manager.save(core_1.IntegrationTenant, integration);
            return {
                integrationTenantId: integration.id,
                tenantId: integration.tenantId,
                organizationId: integration.organizationId,
                apiKey: key.apiKey,
                apiSecret: key.apiSecret
            };
        });
    }
    async getStatus(organizationId) {
        const integration = await this.find(await this.scope(organizationId));
        return {
            isEnabled: !!integration && this.settings(integration)[ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED] === 'true',
            integrationTenantId: integration?.id ?? null
        };
    }
    async removeIntegration(integrationTenantId, organizationId) {
        return this.mutate(organizationId, async (integration, manager) => {
            if (integration.id !== integrationTenantId)
                throw new common_1.NotFoundException('Ever Async integration not found.');
            integration.isActive = false;
            integration.isArchived = true;
            this.set(integration, { [ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED]: 'false' }, manager);
            await manager.save(core_1.IntegrationTenant, integration);
            return { success: true };
        });
    }
    async verifyConnection(serverUrl) {
        const target = this.serverUrl(serverUrl);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${target}/healthz`, {
                timeout: 5000,
                maxRedirects: 0,
                maxContentLength: 1024,
                proxy: false,
                httpsAgent: this.httpsAgent
            }));
            if (typeof response.data !== 'string' || response.data.trim() !== 'ok')
                throw new Error('Unexpected health response');
            return { ok: true, serverUrl: target };
        }
        catch {
            throw new common_1.BadGatewayException('The Ever Async server did not return a valid health response.');
        }
    }
    async getOptions(organizationId) {
        const scope = await this.scope(organizationId);
        const where = { ...scope, isActive: true, isArchived: false };
        const [employees, projects] = await Promise.all([
            this.dataSource.getRepository(core_1.Employee).find({ where, relations: { user: true } }),
            this.dataSource.getRepository(core_1.OrganizationProject).find({ where, order: { name: 'ASC' } })
        ]);
        return {
            employees: employees.map((employee) => ({
                id: employee.id,
                name: [employee.user?.firstName, employee.user?.lastName].filter(Boolean).join(' ') || employee.id
            })),
            projects: projects.map((project) => ({ id: project.id, name: project.name }))
        };
    }
    async authenticateConnector(integrationTenantId, apiKey, apiSecret) {
        if (!(0, class_validator_1.isUUID)(integrationTenantId) || !/^[a-f0-9]{32}$/.test(apiKey) || !/^[a-f0-9]{64}$/.test(apiSecret))
            throw new common_1.UnauthorizedException('Invalid connector credentials.');
        const integration = await this.dataSource.getRepository(core_1.IntegrationTenant).findOne({
            where: { id: integrationTenantId, name: contracts_1.IntegrationEnum.EVER_ASYNC, isActive: true, isArchived: false },
            relations: { settings: true }
        });
        const settings = integration ? this.settings(integration) : {};
        const stored = settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_SECRET_HASH] ?? '';
        if (settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_KEY_ID] !== apiKey || !/^[a-f0-9]{128}$/.test(stored)) {
            throw new common_1.UnauthorizedException('Invalid connector credentials.');
        }
        const digest = (await scryptAsync(apiSecret, apiKey, 64)).toString('hex');
        if (!integration?.id ||
            !integration.tenantId ||
            !integration.organizationId ||
            settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_KEY_ID] !== apiKey ||
            stored.length !== digest.length ||
            !(0, crypto_1.timingSafeEqual)(Buffer.from(stored), Buffer.from(digest))) {
            throw new common_1.UnauthorizedException('Invalid connector credentials.');
        }
        if (settings[ever_async_setting_enum_1.EverAsyncSettingName.IS_ENABLED] !== 'true')
            throw new common_1.ForbiddenException('Ever Async integration is disabled.');
        return {
            integrationTenantId: integration.id,
            tenantId: integration.tenantId,
            organizationId: integration.organizationId,
            projectIds: this.parseArray(settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_PROJECT_IDS]),
            userMappings: this.parseArray(settings[ever_async_setting_enum_1.EverAsyncSettingName.EVER_ASYNC_USER_MAPPINGS])
        };
    }
    async getConnectorTasks(scope, query) {
        if (!!query.chatUserId === !!query.taskId)
            throw new common_1.BadRequestException('Supply exactly one chatUserId or taskId.');
        if (query.taskId && !(0, class_validator_1.isUUID)(query.taskId))
            throw new common_1.BadRequestException('Invalid task ID.');
        if (query.chatUserId &&
            (typeof query.chatUserId !== 'string' ||
                query.chatUserId.length > 200 ||
                !['slack', 'discord'].includes(query.channel ?? '') ||
                typeof query.workspace !== 'string' ||
                !/^[^\s]{1,200}$/.test(query.workspace)))
            throw new common_1.BadRequestException('Invalid chat user ID.');
        const empty = { items: [], total: 0 };
        if (!scope.projectIds.length)
            return empty;
        const employeeId = query.chatUserId
            ? scope.userMappings.find((m) => m.channel === query.channel &&
                m.workspace === query.workspace &&
                m.chatUserId === query.chatUserId)?.employeeId
            : undefined;
        if (query.chatUserId && !employeeId)
            return empty;
        const active = {
            tenantId: scope.tenantId,
            organizationId: scope.organizationId,
            isActive: true,
            isArchived: false
        };
        const tasks = await this.dataSource.getRepository(core_1.Task).find({
            where: {
                ...active,
                ...(query.taskId ? { id: query.taskId } : {}),
                project: { ...active, id: (0, typeorm_1.In)(scope.projectIds) },
                ...(employeeId ? { members: { ...active, id: employeeId } } : {})
            },
            order: { updatedAt: 'DESC', id: 'DESC' },
            take: 10,
            select: { id: true, title: true, status: true, number: true, projectId: true, updatedAt: true }
        });
        const items = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status ?? null,
            taskNumber: task.number ?? null,
            projectId: task.projectId
        }));
        return { items, total: items.length };
    }
};
exports.EverAsyncIntegrationService = EverAsyncIntegrationService;
EverAsyncIntegrationService.sqliteTransactions = new WeakMap();
exports.EverAsyncIntegrationService = EverAsyncIntegrationService = EverAsyncIntegrationService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource,
        axios_1.HttpService])
], EverAsyncIntegrationService);
//# sourceMappingURL=ever-async-integration.service.js.map