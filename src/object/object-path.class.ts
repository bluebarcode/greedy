import { PathType } from './models/path-type';
import { TokenType } from './models/token-type.enum';
import { pathify } from './path-wizard-pathify';

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
