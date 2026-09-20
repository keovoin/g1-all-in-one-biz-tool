"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamJoinRequestService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const utils_2 = require("../core/utils");
const context_1 = require("./../core/context");
const email_service_1 = require("./../email-send/email.service");
const organization_team_service_1 = require("./../organization-team/organization-team.service");
const invite_service_1 = require("./../invite/invite.service");
const role_service_1 = require("./../role/role.service");
const employee_service_1 = require("./../employee/employee.service");
const type_orm_organization_team_join_request_repository_1 = require("./repository/type-orm-organization-team-join-request.repository");
const mikro_orm_organization_team_join_request_repository_1 = require("./repository/mikro-orm-organization-team-join-request.repository");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const type_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const login_attempt_service_1 = require("../auth/login-attempt.service");
let OrganizationTeamJoinRequestService = class OrganizationTeamJoinRequestService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationTeamJoinRequestRepository, mikroOrmOrganizationTeamJoinRequestRepository, typeOrmUserRepository, typeOrmOrganizationTeamEmployeeRepository, _employeeService, _organizationTeamService, _emailService, _inviteService, _roleService, _loginAttemptService) {
        super(typeOrmOrganizationTeamJoinRequestRepository, mikroOrmOrganizationTeamJoinRequestRepository);
        this.typeOrmOrganizationTeamJoinRequestRepository = typeOrmOrganizationTeamJoinRequestRepository;
        this.mikroOrmOrganizationTeamJoinRequestRepository = mikroOrmOrganizationTeamJoinRequestRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.typeOrmOrganizationTeamEmployeeRepository = typeOrmOrganizationTeamEmployeeRepository;
        this._employeeService = _employeeService;
        this._organizationTeamService = _organizationTeamService;
        this._emailService = _emailService;
        this._inviteService = _inviteService;
        this._roleService = _roleService;
        this._loginAttemptService = _loginAttemptService;
    }
    /**
     *
     * @param options
     * @returns
     */
    async findAll(options) {
        return await super.findAll(options);
    }
    /**
     * Create organization team join request
     *
     * @param entity
     * @param languageCode
     * @returns
     */
    async create(entity, languageCode) {
        const { organizationTeamId, email } = entity;
        /** find existing team join request and throw exception */
        const request = await this.count({
            where: {
                organizationTeamId,
                email
            }
        });
        if (request > 0) {
            throw new common_1.ConflictException('You have sent already join request for this team, please wait for manager response.');
        }
        /** Create new team join request */
        try {
            const organizationTeam = await this._organizationTeamService.findOneByIdString(organizationTeamId, {
                where: {
                    public: true
                },
                relations: {
                    organization: true
                }
            });
            const { organization, organizationId, tenantId } = organizationTeam;
            const code = (0, utils_1.generateAlphaNumericCode)();
            const payload = {
                email,
                tenantId,
                organizationId,
                organizationTeamId,
                code
            };
            /** Generate JWT token using above JWT payload */
            const token = (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_SECRET, {
                expiresIn: `${config_1.environment.TEAM_JOIN_REQUEST_EXPIRATION_TIME}s`
            });
            /**
             * Creates a new entity instance and copies all entity properties from this object into a new entity.
             * Note that it copies only properties that are present in entity schema.
             */
            const createEntityLike = this.typeOrmRepository.create({
                organizationTeamId,
                email,
                organizationId,
                tenantId,
                code,
                token,
                status: null
            });
            const organizationTeamJoinRequest = await this.save(createEntityLike);
            /** Place here organization team join request email to send verification code*/
            let { appName, appLogo, appSignature, appLink, companyLink, companyName } = entity;
            this._emailService.organizationTeamJoinRequest(organizationTeam, organizationTeamJoinRequest, languageCode, organization, {
                appName,
                appLogo,
                appSignature,
                appLink,
                companyLink,
                companyName
            });
            return organizationTeamJoinRequest;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error while requesting join organization team');
        }
    }
    /**
     * Validate organization team join request
     *
     * @param options
     * @returns
     */
    async validateJoinRequest(options) {
        const { email, token, code, organizationTeamId } = options;
        // The confirmation code is six alphanumeric characters — roughly 2^31 possibilities — so a
        // per-address rate limit alone leaves it guessable by anything distributed. Count failures
        // against the email instead, outside the catch that turns everything into a 400.
        const attempt = await this._loginAttemptService.begin(login_attempt_service_1.LoginAttemptScope.TEAM_JOIN_CODE, email);
        try {
            let record;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const item = await this.mikroOrmRepository.findOneOrFail({
                        email,
                        organizationTeamId,
                        expiredAt: { $gte: new Date() },
                        status: null,
                        $or: [{ code }, { token }]
                    });
                    record = this.serialize(item);
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.setFindOptions({
                        select: {
                            id: true,
                            email: true,
                            organizationTeamId: true
                        }
                    });
                    query.where((qb) => {
                        qb.andWhere({
                            email,
                            organizationTeamId,
                            expiredAt: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                            status: (0, typeorm_1.IsNull)()
                        });
                        // Only OR together the credentials that were actually supplied. The DTO validates code
                        // or token, not both, so the other may arrive as null: as an OR arm that would now read
                        // `token IS NULL` and widen a security-sensitive lookup instead of being dropped.
                        const credentials = [...(code ? [{ code }] : []), ...(token ? [{ token }] : [])];
                        if (credentials.length === 0) {
                            throw new common_1.BadRequestException('A confirmation code or token is required');
                        }
                        qb.andWhere(credentials);
                    });
                    record = await query.getOneOrFail();
                    break;
                }
            }
            await super.update(record.id, {
                status: contracts_1.OrganizationTeamJoinRequestStatusEnum.REQUESTED
            });
            delete record.id;
            await attempt.succeed();
            return record;
        }
        catch (error) {
            // A request that carried no code or token at all guessed nothing, so it gives its slot back
            // instead of counting against the email (a buggy client must not lock the join flow). Every
            // other path — above all the lookup miss of a wrong code — counts: the check fails closed.
            if (error instanceof common_1.BadRequestException) {
                await attempt.release();
            }
            else {
                await attempt.fail();
            }
            throw new common_1.BadRequestException();
        }
    }
    async resendConfirmationCode(entity, languageCode) {
        const { organizationTeamId, email } = entity;
        try {
            /** find existing team join request */
            const request = await this.findOneByOptions({
                where: {
                    organizationTeamId,
                    email,
                    status: (0, typeorm_1.IsNull)()
                },
                relations: {
                    organizationTeam: {
                        organization: true
                    }
                }
            });
            const code = (0, utils_1.generateAlphaNumericCode)();
            const payload = {
                email,
                tenantId: request.tenantId,
                organizationId: request.organizationId,
                organizationTeamId,
                code
            };
            /** Generate JWT token using above JWT payload */
            const token = (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_SECRET, {
                expiresIn: `${config_1.environment.TEAM_JOIN_REQUEST_EXPIRATION_TIME}s`
            });
            /** Update code, token and expiredAt */
            await super.update(request.id, {
                code,
                token,
                expiredAt: moment(new Date()).add(config_1.environment.TEAM_JOIN_REQUEST_EXPIRATION_TIME, 'seconds').toDate()
            });
            /** Place here organization team join request email to send verification code*/
            let { appName, appLogo, appSignature, appLink, companyLink, companyName } = entity;
            this._emailService.organizationTeamJoinRequest(request.organizationTeam, {
                ...request,
                code,
                token
            }, languageCode, request.organizationTeam.organization, {
                appName,
                appLogo,
                appSignature,
                appLink,
                companyLink,
                companyName
            });
        }
        finally {
            return new Object({
                status: common_1.HttpStatus.OK,
                message: `OK`
            });
        }
    }
    async acceptRequestToJoin(id, action, languageCode) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const createdByUserId = context_1.RequestContext.currentUserId();
        const request = await this.findOneByWhereOptions({
            id,
            tenantId
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found.');
        }
        /**
         * ACCEPTED
         */
        if (action === contracts_1.OrganizationTeamJoinRequestStatusEnum.ACCEPTED) {
            /**
             * Fetch user if already present in current tenant
             */
            let currentTenantUser = await this.typeOrmUserRepository.findOne({
                where: {
                    email: request.email,
                    tenantId
                },
                relations: {
                    tenant: true,
                    role: true
                }
            });
            /**
             * Accepted Case - 1
             * Current user is already part of tenant as separate user
             */
            if (currentTenantUser) {
                const employee = await this._employeeService.findOneByOptions({
                    where: {
                        userId: currentTenantUser.id
                    }
                });
                /**
                 * Check if user is already part of requested team
                 */
                let employeePresentInTeam = null;
                if (employee) {
                    employeePresentInTeam = await this._organizationTeamService.findOneByWhereOptions({
                        members: {
                            employeeId: employee.id
                        },
                        id: request.organizationTeamId
                    });
                }
                /**
                 * Add employee to team
                 */
                if (!employeePresentInTeam && employee) {
                    await this.typeOrmOrganizationTeamEmployeeRepository.save({
                        employeeId: employee.id,
                        organizationTeamId: request.organizationTeamId,
                        tenantId,
                        organizationId: request.organizationId
                    });
                    await super.update(id, {
                        status: contracts_1.OrganizationTeamJoinRequestStatusEnum.ACCEPTED,
                        userId: currentTenantUser.id
                    });
                }
            }
            /**
             * Accepted Case - 2
             * Current user is not belong to this tenant
             */
            if (!currentTenantUser) {
                const names = request?.fullName?.split(' ');
                const role = await this._roleService.findOneByWhereOptions({
                    name: contracts_1.RolesEnum.EMPLOYEE
                });
                const newTenantUser = await this._inviteService.createUser({
                    user: {
                        firstName: (names && names.length && names[0]) || '',
                        lastName: (names && names.length && names[1]) || '',
                        email: request.email,
                        tenantId: tenantId,
                        role: role
                    },
                    organizationId: request.organizationId,
                    createdByUserId
                }, request.organizationTeamId, languageCode);
                await super.update(id, {
                    status: contracts_1.OrganizationTeamJoinRequestStatusEnum.ACCEPTED,
                    userId: newTenantUser.id
                });
            }
        }
        /**
         * REJECTED
         */
        if (action === contracts_1.OrganizationTeamJoinRequestStatusEnum.REJECTED) {
            await super.update(id, {
                status: contracts_1.OrganizationTeamJoinRequestStatusEnum.REJECTED
            });
        }
    }
};
exports.OrganizationTeamJoinRequestService = OrganizationTeamJoinRequestService;
exports.OrganizationTeamJoinRequestService = OrganizationTeamJoinRequestService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_team_join_request_repository_1.TypeOrmOrganizationTeamJoinRequestRepository,
        mikro_orm_organization_team_join_request_repository_1.MikroOrmOrganizationTeamJoinRequestRepository,
        type_orm_user_repository_1.TypeOrmUserRepository,
        type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
        employee_service_1.EmployeeService,
        organization_team_service_1.OrganizationTeamService,
        email_service_1.EmailService,
        invite_service_1.InviteService,
        role_service_1.RoleService,
        login_attempt_service_1.LoginAttemptService])
], OrganizationTeamJoinRequestService);
//# sourceMappingURL=organization-team-join-request.service.js.map