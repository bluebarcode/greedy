import { currentToken, OpFunc } from '../models/special-operations';
import {
  StateValues,
  TraversablePathType
} from '../models/traversable-path.type';
import { oc } from '../path-wizard-pathify';

export function $filter<T, Flat, OriginType, PathVariables, Store>(
  filterFunc: (
    value: T,
    variables: StateValues<PathVariables, Store>
  ) => boolean
): OpFunc<T[], T[], Flat, Flat, PathVariables, Store, Store, OriginType> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const previousPipes = tokens.current.pipe || [];
    const filter = (
      _data: T[],
      _variables: StateValues<PathVariables, Store>
    ): T[] => _data.filter(entry => filterFunc(entry, _variables));
    previousPipes.push({ data: filter, store: undefined });
    tokens.current.pipe = previousPipes;
    const result = oc(tokens.tokens, tokens.current, undefined);
    return (result as unknown) as TraversablePathType<
      T[],
      Flat,
      OriginType,
      PathVariables,
      Store
    >;
  };
}
