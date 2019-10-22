import { proxy } from '../implementation/path-wizard-pathify';
import { TokenType } from '../implementation/token-type.enum';
import { PathToken } from '../typings/path-token';
import { currentToken, OpFunc } from '../typings/special-operations';
import { StateValues } from '../typings/state-values';
import { TraversableGreedyType } from '../typings/traversable-path.type';

export function $filter<T, Flat, OriginType, PathVariables, Store>(
  filterFunc: (
    value: T,
    variables: StateValues<PathVariables, Store>
  ) => boolean
): OpFunc<T[], T[], Flat, Flat, PathVariables, Store, Store, OriginType> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const filter = (
      _data: T[],
      _variables: StateValues<PathVariables, Store>
    ): T[] => _data.filter(entry => filterFunc(entry, _variables));
    const newToken: PathToken = {
      property: '',
      type: TokenType.pipe,
      pipe: [{ data: filter }]
    };
    const result = proxy([...tokens.tokens, newToken], newToken, undefined);
    return (result as unknown) as TraversableGreedyType<
      T[],
      Flat,
      OriginType,
      PathVariables,
      Store
    >;
  };
}
