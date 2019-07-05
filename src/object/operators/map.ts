import { currentToken, OpFunc } from '../models/special-operations';
import {
  StateValues,
  TraversablePathType
} from '../models/traversable-path.type';
import { oc } from '../path-wizard-pathify';

export function $map<T, Flat, OriginType, PathVariables, R, Store>(
  mapFunc: (value: T, variables: StateValues<PathVariables, Store>) => R
): OpFunc<T, R, Flat, Flat, PathVariables, Store, Store, OriginType> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const previousPipes = tokens.current.pipe || [];
    // @ts-ignore
    previousPipes.push({ data: mapFunc });
    tokens.current.pipe = previousPipes;
    const result = oc(tokens.tokens, tokens.current, undefined);
    // @ts-ignore
    return result as TraversablePathType<
      R,
      Flat,
      OriginType,
      PathVariables,
      Store
    >;
  };
}
