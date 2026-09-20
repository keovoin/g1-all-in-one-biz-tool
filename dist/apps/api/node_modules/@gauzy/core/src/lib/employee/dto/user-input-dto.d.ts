import { IRole, IUser } from '@gauzy/contracts';
import { CreateUserDTO } from './../../user/dto';
export declare class UserInputDTO extends CreateUserDTO implements IUser {
    role: IRole;
}
