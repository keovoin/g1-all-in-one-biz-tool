import { CustomDecorator } from '@nestjs/common';
import { RolesEnum } from '@gauzy/contracts';
export declare const Roles: (...roles: RolesEnum[]) => CustomDecorator;
