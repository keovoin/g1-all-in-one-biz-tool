import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IReaction, IReactionCreateInput, IReactionUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { EmployeeService } from '../employee/employee.service';
import { Reaction } from './reaction.entity';
import { TypeOrmReactionRepository } from './repository/type-orm-reaction.repository';
import { MikroOrmReactionRepository } from './repository/mikro-orm-reaction.repository';
export declare class ReactionService extends TenantAwareCrudService<Reaction> {
    readonly typeOrmReactionRepository: TypeOrmReactionRepository;
    readonly mikroOrmReactionRepository: MikroOrmReactionRepository;
    private readonly _employeeService;
    constructor(typeOrmReactionRepository: TypeOrmReactionRepository, mikroOrmReactionRepository: MikroOrmReactionRepository, _employeeService: EmployeeService);
    /**
     * Creates a reaction based on the provided input. If a reaction matching the given criteria
     * already exists, the function will delete (toggle) the reaction instead.
     *
     * @param input - The input data required to create a reaction.
     * @returns A Promise resolving to the created reaction, or void if the reaction was toggled (deleted).
     */
    create(input: IReactionCreateInput): Promise<IReaction>;
    /**
     * Updates a reaction based on the provided id and update input.
     * It ensures that the reaction exists and belongs to the current employee.
     *
     * @param id - The unique identifier of the reaction.
     * @param input - The update data for the reaction.
     * @returns A Promise that resolves to the updated reaction or an UpdateResult.
     * @throws BadRequestException if the employee or tenant context is missing,
     *         or if the reaction is not found.
     */
    update(id: ID, input: IReactionUpdateInput): Promise<IReaction | UpdateResult>;
    /**
     * Deletes a reaction by its ID, ensuring that the reaction belongs to the current employee and tenant.
     *
     * @param id - The unique identifier of the reaction to be deleted.
     * @returns A Promise that resolves to the result of the deletion operation.
     * @throws BadRequestException if the deletion fails or if the employee/tenant context is missing.
     */
    delete(id: ID): Promise<DeleteResult>;
}
