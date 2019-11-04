import { PathToken } from './path-token';
import { PathType } from './path-type';
import { StateValues } from './state-values';
import { Endpoint, TraversableGreedyType } from './traversable-greedy.type';
import { ValidationType } from './validation-type';

/**
 * disable linter for the empty type
 */
// tslint:disable-next-line
type EmptyGeneric = {};

/**
 * The function structure an operator function for $_$.pipe() has to return.
 */
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
  source: TraversableGreedyType<
    TIn,
    FlatIn,
    OriginType,
    PathVariablesType,
    StoreIn
  >
) => TraversableGreedyType<
  TOut,
  FlatOut,
  OriginType,
  PathVariablesType,
  StoreOut
>;

/**
 * A Helper function that retrieves the current(=last) token of a Path. Used in Operator functions.
 * TODO: Maybe it is not needed for the user to do, but for the framework to provide the current token at the places needed.
 * @param path
 */
export const currentToken = <T, A, B, C, D>(
  path: TraversableGreedyType<T, A, B, C, D>
): { tokens: PathToken[]; current: PathToken } => {
  const tokens = path.$token;
  const current = tokens.slice(tokens.length - 1, tokens.length)[0];
  return { tokens, current };
};

/**
 * This Type determines the last of the 9 Types that are passed that is not empty. This is used at the $_$.pipe() function.
 * TODO: Make this recursive.
 */
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

/**
 * This Interface provides all special operations that are available to manipulate the path. If new functions are to be defined it is most likely to be done here.
 */
export interface SpecialOperations<
  Flat,
  OriginType,
  T,
  PathVariablesType,
  Store
> {
  keepIf(
    filter: (
      value: T extends any[] ? T[number] : T,
      pathVariables: StateValues<PathVariablesType, Store>
    ) => boolean
  ): TraversableGreedyType<T, Flat, OriginType, PathVariablesType, Store>;
  removeIfUnvisited(): TraversableGreedyType<
    T,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >;
  unsetIfUnresolved(): TraversableGreedyType<
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
  ): TraversableGreedyType<
    LastNonUndefinedType<aTOut, bTOut, cTOut, dTOut>,
    LastNonUndefinedType<aFOut, bFOut, cFOut, dFOut>,
    OriginType,
    PathVariablesType,
    LastNonUndefinedType<aStoreOut, bStoreOut, cStoreOut, dStoreOut>
  >;

  backToRoot(): TraversableGreedyType<
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
  ): Flat extends true
    ? Endpoint<Flat, OriginType, boolean>
    : Endpoint<Flat, OriginType, boolean> & ValidationType<boolean>;
  // unite<X extends keyof T>(
  //   key1: X
  // ): TraversablePathType<T[X], Flat, OriginType, PathVariablesType, Store>;
  // unite<X extends keyof T>(
  //   ...keys: Extract<keyof T, X>[]
  // ): TraversablePathType<T[X], Flat, OriginType, PathVariablesType, Store>;
}
export interface Finish<Flat, OriginType, T, PathVariablesType, Store> {
  finish(): PathType<
    Flat extends true ? T : T[],
    OriginType,
    PathVariablesType
  >;
}
