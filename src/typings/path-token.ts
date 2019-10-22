import { TokenType } from '../implementation/token-type.enum';
import { StateValues } from './state-values';

export interface PathToken {
  keepIf?: (value: any, pathVariables: StateValues<any, any>) => boolean;
  uniteKey?: string;
  unsetIfUnresolved?: boolean;
  hashFunction?: (data: any) => string;
  removeIfUndefined?: boolean;
  pipe?: PipeSummary[];
  type: TokenType;
  property: string | string[];
  entryProperty?: string;
  index?: any;
  defaultValue?: any;
  filter?: (data: any) => boolean;
  validator?: (data: any, pathVariables: StateValues<any, any>) => boolean;
  reducer?: (previous: boolean, current: boolean) => boolean;
  initialValue?: boolean;
  branchKey?: string;
}

interface PipeSummary {
  data?: (data: any, pathVariables: StateValues<any, any>) => any;
  store?: (pathVariables: StateValues<any, any>, data: any) => any;
}
