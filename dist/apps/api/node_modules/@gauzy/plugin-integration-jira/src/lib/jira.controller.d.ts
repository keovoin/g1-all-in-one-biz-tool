import { Type } from '@nestjs/common';
import { JiraModuleOptions } from './jira.types';
/**
 * Factory function to create a NestJS controller class for handling webhook hooks.
 * @param path The path at which the controller should listen for webhook requests.
 */
export declare function getControllerClass({ path, config }: JiraModuleOptions): Type<any>;
