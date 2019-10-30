import { proxy } from '../implementation/path-wizard-pathify';
import { TokenType } from '../implementation/token-type.enum';
import { PathToken } from '../typings/path-token';
import { currentToken, OpFunc } from '../typings/special-operations';

type fixedStoreVariables = 'unite1' | 'unite2' | 'unite3' | 'unite4' | 'unite5'; // When this issue is resolved https://github.com/microsoft/TypeScript/issues/13573 we can build it dynamically
type Mapped = { [P in fixedStoreVariables]: string };

interface UniteKeys {
  unite1: string;
  unite2: string;
  unite3: string;
  unite4: string;
}

export function $unite<
  T,
  Flat,
  OriginType,
  PathVariables,
  Store,
  K extends keyof Exclude<T, null>,
  StoreKey extends keyof UniteKeys
>(
  storeKey: StoreKey,
  ...keys: K[]
): OpFunc<
  T,
  Exclude<T, null>[K],
  Flat,
  Flat,
  PathVariables,
  Store,
  Store & UniteKeys,
  OriginType
> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const newToken: PathToken = {
      property: <any>keys,
      type: TokenType.property,
      uniteKey: storeKey
    };
    const result = proxy([...tokens.tokens, newToken], newToken, undefined);
    // @ts-ignore
    return result as any;
  };
}

// unite<X extends keyof T>(
//   ...keys: Extract<keyof T, X>[]
// ): TraversablePathType<T[X], Flat, OriginType, PathVariablesType, Store>;
