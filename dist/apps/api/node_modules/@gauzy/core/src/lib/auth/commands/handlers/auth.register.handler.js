"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRegisterHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const auth_register_command_1 = require("../auth.register.command");
const auth_service_1 = require("../../auth.service");
const utils_1 = require("../../../core/utils");
const context_1 = require("../../../core/context");
const user_service_1 = require("../../../user/user.service");
const type_orm_role_repository_1 = require("../../../role/repository/type-orm-role.repository");
const mikro_orm_role_repository_1 = require("../../../role/repository/mikro-orm-role.repository");
let AuthRegisterHandler = class AuthRegisterHandler {
    constructor(authService, userService, typeOrmRoleRepository, mikroOrmRoleRepository) {
        this.authService = authService;
        this.userService = userService;
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
    }
    /**
     * Executes the user registration command, handling specific checks for SUPER_ADMIN role.
     *
     * @param command The AuthRegisterCommand containing user registration input and optional parameters.
     * @returns A Promise resolving to the registered IUser object.
     * @throws BadRequestException if input is missing required fields.
     * @throws UnauthorizedException if the user initiating registration is not authorized.
     */
    async execute(command) {
        const { input, languageCode } = command;
        let targetRoleName = null;
        // The target role may arrive as `roleId` or as a `role` object; resolve BOTH from the DATABASE.
        // A client-supplied `role.name` must never feed the SUPER_ADMIN gate below (a role object with
        // only an id, or a spoofed name, used to skip it), and checking only the first of the two is not
        // enough either: the `role` RELATION wins over the flat `roleId` when the row is persisted
        // (AuthService.register pins roleId = role.id), so a body pairing a harmless `roleId` with a
        // privileged `role: { id }` would be validated as the harmless one and registered as the
        // privileged one.
        const targetRoleIds = [input.user?.roleId, input.user?.role?.id].filter((roleId) => !!roleId);
        if (input.user?.role && !targetRoleIds.length) {
            throw new common_1.BadRequestException('The specified role does not reference a valid role.');
        }
        if (targetRoleIds.length) {
            // Get tenant id from request context
            const tenantId = context_1.RequestContext.currentTenantId();
            for (const targetRoleId of targetRoleIds) {
                // Resolve role entity to get the name
                try {
                    const whereCondition = {
                        id: targetRoleId,
                        ...(tenantId ? { tenantId } : {})
                    };
                    const role = (0, utils_1.getORMType)() === utils_1.MultiORMEnum.MikroORM
                        ? await this.mikroOrmRoleRepository.findOneOrFail(whereCondition)
                        : await this.typeOrmRoleRepository.findOneByOrFail(whereCondition);
                    // The strictest of the candidates decides: if ANY of them is SUPER_ADMIN, the creator
                    // check below must run.
                    if (role.name === contracts_1.RolesEnum.SUPER_ADMIN || !targetRoleName) {
                        targetRoleName = role.name;
                    }
                }
                catch {
                    throw new common_1.BadRequestException('The specified roleId does not reference a valid role.');
                }
            }
        }
        // Check if the target role is SUPER_ADMIN — only an AUTHENTICATED super admin may create one.
        if (targetRoleName === contracts_1.RolesEnum.SUPER_ADMIN) {
            // `/auth/register` is a public route, and `createdByUserId` is a BODY field: checking only
            // that the referenced user is a super admin authorized nobody — any anonymous caller could
            // name a known super admin's id and register itself as SUPER_ADMIN. The creator must be the
            // authenticated caller, and the caller must hold SUPER_ADMIN_EDIT.
            const currentUserId = context_1.RequestContext.currentUserId();
            if (!currentUserId) {
                throw new common_1.UnauthorizedException('Only SUPER_ADMIN can register other SUPER_ADMIN users.');
            }
            // The UI sends the logged-in user's id here; anything else is an attempt to borrow identity.
            if (input.createdByUserId && String(input.createdByUserId) !== String(currentUserId)) {
                throw new common_1.UnauthorizedException('createdByUserId must reference the authenticated user.');
            }
            if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.SUPER_ADMIN_EDIT)) {
                throw new common_1.UnauthorizedException('Only SUPER_ADMIN can register other SUPER_ADMIN users.');
            }
            // Fetch role details of the creator (the authenticated caller — never a body-supplied id)
            const creator = await this.userService.findOneByIdString(currentUserId, { relations: { role: true } });
            // Verify if the creator's role is SUPER_ADMIN
            if (creator?.role?.name !== contracts_1.RolesEnum.SUPER_ADMIN) {
                throw new common_1.UnauthorizedException('Only SUPER_ADMIN can register other SUPER_ADMIN users.');
            }
            // Pin the recorded creator to the caller so the persisted column cannot be spoofed either.
            input.createdByUserId = currentUserId;
        }
        // Register the user using the AuthService
        return await this.authService.register(input, languageCode);
    }
};
exports.AuthRegisterHandler = AuthRegisterHandler;
exports.AuthRegisterHandler = AuthRegisterHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(auth_register_command_1.AuthRegisterCommand),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository])
], AuthRegisterHandler);
//# sourceMappingURL=auth.register.handler.js.map