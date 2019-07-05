import { PathToken } from './path-token';
import { PathType, ValidationType } from './path-type';
import { StateValues, TraversablePathType } from './traversable-path.type';

/**
 * disable linter for the empty type
 */
// tslint:disable-next-line
type EmptyGeneric = {};

export type OpFunc<
  TIn,
  TOut = any,
  FlatIn = any,
  FlatOut = any,
  PathVariablesType = any,
  StoreIn = any,
  StoreOut = any,
  OriginType = any
> = (
  source: TraversablePathType<
    TIn,
    FlatIn,
    OriginType,
    PathVariablesType,
    StoreIn
  >
) => TraversablePathType<
  TOut,
  FlatOut,
  OriginType,
  PathVariablesType,
  StoreOut
>;

export const currentToken = <T>(
  path: TraversablePathType<T, {}>
): { tokens: PathToken[]; current: PathToken } => {
  const tokens = path.$_$.finish().get();
  const current = tokens.slice(tokens.length - 1, tokens.length)[0];
  return { tokens, current };
};

type LastNonUndefinedType<
  A,
  B = EmptyGeneric,
  C = EmptyGeneric,
  D = EmptyGeneric,
  E = EmptyGeneric,
  F = EmptyGeneric,
  G = EmptyGeneric,
  H = EmptyGeneric,
  I = EmptyGeneric
> = EmptyGeneric extends I
  ? EmptyGeneric extends H
    ? EmptyGeneric extends G
      ? EmptyGeneric extends F
        ? EmptyGeneric extends E
          ? EmptyGeneric extends D
            ? EmptyGeneric extends C
              ? EmptyGeneric extends B
                ? A
                : B
              : C
            : D
          : E
        : F
      : G
    : H
  : I;

export interface SpecialOperations<
  Flat,
  OriginType,
  T,
  PathVariablesType,
  Store
> {
  removeIfUnvisited(): TraversablePathType<
    T,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >;
  unsetIfUnresolved(): TraversablePathType<
    T,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >;
  pipe<
    aTOut,
    aFOut,
    aStoreOut,
    bTOut,
    bFOut,
    bStoreOut,
    cTOut,
    cFOut,
    cStoreOut,
    dTOut,
    dFOut,
    dStoreOut
  >(
    op1: OpFunc<
      T,
      aTOut,
      Flat,
      aFOut,
      PathVariablesType,
      Store,
      aStoreOut,
      OriginType
    >,
    op2?: OpFunc<
      aTOut,
      bTOut,
      aFOut,
      bFOut,
      PathVariablesType,
      aStoreOut,
      bStoreOut,
      OriginType
    >,
    op3?: OpFunc<
      bTOut,
      cTOut,
      bFOut,
      cFOut,
      PathVariablesType,
      bStoreOut,
      cStoreOut,
      OriginType
    >,
    op4?: OpFunc<
      cTOut,
      dTOut,
      cFOut,
      dFOut,
      PathVariablesType,
      cStoreOut,
      dStoreOut,
      OriginType
    >
  ): TraversablePathType<
    LastNonUndefinedType<aTOut, bTOut, cTOut, dTOut>,
    LastNonUndefinedType<aFOut, bFOut, cFOut, dFOut>,
    OriginType,
    PathVariablesType,
    LastNonUndefinedType<aStoreOut, bStoreOut, cStoreOut, dStoreOut>
  >;
  finish(): PathType<Flat extends true ? T : T[]>;
  backToRoot(): TraversablePathType<
    OriginType,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >;
  validIf(
    validator: (
      value: T,
      pathVariables: StateValues<PathVariablesType, Store>
    ) => boolean
  ): Flat extends true ? PathType<boolean> : ValidationType<boolean>;
  // unite<X extends keyof T>(
  //   key1: X
  // ): TraversablePathType<T[X], Flat, OriginType, PathVariablesType, Store>;
  unite<X extends keyof T>(
    ...keys: Extract<keyof T, X>[]
  ): TraversablePathType<T[X], Flat, OriginType, PathVariablesType, Store>;
}
