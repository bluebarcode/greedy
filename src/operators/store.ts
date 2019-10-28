import { proxy } from '../implementation/path-wizard-pathify';
import { TokenType } from '../implementation/token-type.enum';
import { PathToken } from '../typings/path-token';
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
    const newToken: PathToken = {
      property: '',
      type: TokenType.pipe,
      pipe: [{ store: storeFunc }]
    };
    const result = proxy([...tokens.tokens, newToken], newToken, undefined);
    // @ts-ignore
    return result as TraversableGreedyType<
      T,
      Flat,
      OriginType,
      PathVariables,
      0 extends (1 & StoreIn) ? StoreOut : StoreIn & StoreOut
    >;
  };
}
