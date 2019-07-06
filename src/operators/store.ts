import { oc } from '../implementation/path-wizard-pathify';
import { currentToken, OpFunc } from '../typings/special-operations';
import { StateValues } from '../typings/state-values';

export function $store<T, Flat, PathVariables, StoreIn, StoreOut, OriginType>(
  storeFunc: (
    pathVariables: StateValues<PathVariables, StoreIn>,
    value: T
  ) => StoreOut
): OpFunc<
  T,
  T,
  Flat,
  Flat,
  PathVariables,
  StoreIn,
  0 extends (1 & StoreIn) ? StoreOut : StoreIn & StoreOut,
  OriginType
> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const previousPipes = tokens.current.pipe || [];
    previousPipes.push({ store: storeFunc });
    tokens.current.pipe = previousPipes;
    const result = oc(tokens.tokens, tokens.current, undefined);
    // @ts-ignore
    return result as TraversablePathType<
      T,
      Flat,
      OriginType,
      PathVariables,
      0 extends (1 & StoreIn) ? StoreOut : StoreIn & StoreOut
    >;
  };
}
