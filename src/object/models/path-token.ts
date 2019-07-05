import { TokenType } from './token-type.enum';
import { StateValues } from './traversable-path.type';

export interface PathToken {
  unsetIfUnresolved?: boolean;
  hashFunction?: (data: any) => string;
  removeIfUndefined?: boolean;
  pipe?: PipeSummary[];
  type: TokenType;
  property: string;
  entryProperty?: string;
  index?: any;
  defaultValue?: any;
  filter?: (data: any) => boolean;
  validator?: (data: any, pathVariables: StateValues<any, any>) => boolean;
  reducer?: (previous: boolean, current: boolean) => boolean;
  initialValue?: boolean;
}

interface PipeSummary {
  data?: (data: any, pathVariables: StateValues<any, any>) => any;
  store?: (pathVariables: StateValues<any, any>, data: any) => any;
}
