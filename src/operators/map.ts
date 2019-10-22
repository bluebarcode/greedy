import { proxy } from '../implementation/path-wizard-pathify';
import { TokenType } from '../implementation/token-type.enum';
import { PathToken } from '../typings/path-token';
import { currentToken, OpFunc } from '../typings/special-operations';
import { StateValues } from '../typings/state-values';

export function $map<T, Flat, OriginType, PathVariables, R, Store>(
  mapFunc: (value: T, variables: StateValues<PathVariables, Store>) => R,
  branchKey?:
    | keyof ({} extends PathVariables ? void : PathVariables)
    | keyof ({} extends Store ? void : Store)
): OpFunc<T, R, Flat, Flat, PathVariables, Store, Store, OriginType> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const newToken: PathToken = {
      property: '',
      type: TokenType.pipe,
      pipe: [{ data: mapFunc }],
      branchKey: <string>branchKey || ''
    };
    const result = proxy([...tokens.tokens, newToken], newToken, undefined);
    // @ts-ignore
    return result as TraversableGreedyType<
      R,
      Flat,
      OriginType,
      PathVariables,
      Store
    >;
  };
}
