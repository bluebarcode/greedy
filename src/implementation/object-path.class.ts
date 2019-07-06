import { PathType } from '../typings/path-type';
import { pathify } from './path-wizard-pathify';
import { TokenType } from './token-type.enum';

export class ObjectPath<BaseType, PathVariablesType = any> {
  start = pathify(<BaseType>{}, <PathVariablesType>{});
  variable = <K extends keyof PathVariablesType>(
    variable: K
  ): PathType<PathVariablesType[K]> =>
    <PathType<PathVariablesType[K]>>{
      get() {
        return [{ type: TokenType.property_dynamic, property: variable }];
      }
    };
}
