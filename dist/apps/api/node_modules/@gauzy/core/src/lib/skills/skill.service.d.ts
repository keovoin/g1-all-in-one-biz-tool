import { Skill } from './skill.entity';
import { TenantAwareCrudService } from './../core/crud';
import { MikroOrmSkillRepository } from './repository/mikro-orm-skill.repository';
import { TypeOrmSkillRepository } from './repository/type-orm-skill.repository';
export declare class SkillService extends TenantAwareCrudService<Skill> {
    constructor(typeOrmSkillRepository: TypeOrmSkillRepository, mikroOrmSkillRepository: MikroOrmSkillRepository);
    /**
     * Finds a skill by its name.
     *
     * @param {string} name - The name of the skill to retrieve.
     * @returns {Promise<Skill | null>} - A promise resolving to the skill entity if found, or `null` if not found.
     */
    findOneByName(name: string): Promise<Skill | null>;
}
