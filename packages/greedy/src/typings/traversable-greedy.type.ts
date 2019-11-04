import { KeysOfType } from './key-of-type';
import { PathToken } from './path-token';
import { SpecialOperations } from './special-operations';

/***
 * This Type extracts all the properties of a non array like type for deep traversal.
 */
type ObjectWrapper<Flat, OriginType, T, PathVariablesType, Store> = {
  [K in keyof T]-?: TraversableGreedyType<
    T[K],
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >;
};
/**
 * This interface is the structure for all dynamic values used during processing a path in the Resolver.
 */
export interface StateValues<PathVariablesType, Store> {
  path: PathVariablesType;
  store: Store;
}
/**
 * Endpoint to avoice Excessively deep Types. But the Generic Types HAVE to be used - else you cannot further process them in other functions.
 * This is the proper Way to access all types of a Path.
 */
export interface Endpoint<
  Flat,
  OriginType = any,
  T = any,
  PathVariablesType = any,
  Store = any
> {
  $token: PathToken[];
  $______?: [Flat, OriginType, T, PathVariablesType, Store];
  //$_$: SpecialOperations<Flat, OriginType, T, PathVariablesType, Store>;
}

/***
 * This interface is used just to extend all Greedy Types to implement the $_$ keyword for extended processing.
 * */
export interface All<Flat, OriginType, T, PathVariablesType, Store> {
  $_$: SpecialOperations<Flat, OriginType, T, PathVariablesType, Store>;
}

/**
 * This type is used to extend all Greedy types to offer a default-value mechanic. Implemented by the proxy function.
 */
type DefaultValueable<Flat, OriginType, T, PathVariables, Store> = (
  defaultVal: T
) => TraversableGreedyType<T, Flat, OriginType, PathVariables, Store>;

/**
 * This is the aequivalent to the ObjectWrapper just for Array types.
 */
interface ArrayWrapper<Flat, OriginType, T, PathVariablesType, Store> {
  length: TraversableGreedyType<number, Flat, OriginType, PathVariablesType>;
  [K: number]: TraversableGreedyType<T, Flat, OriginType, PathVariablesType>;
  (
    filterKey: keyof T,
    filterValue:
      | keyof PathVariablesType
      | keyof ({} extends Store ? void : Store)
  ): TraversableGreedyType<T, Flat, OriginType, PathVariablesType, Store>;
  arrayIndex(
    index: KeysOfType<PathVariablesType, number>
  ): TraversableGreedyType<T, Flat, OriginType, PathVariablesType, Store>;
  all(
    hash?: (object: T) => string | null
  ): TraversableGreedyType<T, false, OriginType, PathVariablesType, Store>;
  filter(
    filterKey: keyof T,
    filterValue: keyof PathVariablesType | keyof Store
  ): TraversableGreedyType<T, false, OriginType, PathVariablesType, Store>;
}

/***
 * This Type determines what kind of property T is. Is it an array or not.
 */
type DataWrapper<
  Flat,
  OriginType,
  T,
  PathVariablesType,
  Store
> = T extends any[] // Is T array-like?
  ? ArrayWrapper<Flat, OriginType, T[number], PathVariablesType, Store>
  : T extends object // Is T object-like?
  ? ObjectWrapper<Flat, OriginType, T, PathVariablesType, Store>
  : T;

/***
 * This Type combines all the other Types.
 */
export type TraversableGreedyType<
  T,
  Flat = false,
  OriginType = any,
  PathVariablesType = any,
  Store = any
> = Endpoint<Flat, OriginType, T, PathVariablesType, Store> &
  All<Flat, OriginType, T, PathVariablesType, Store> &
  DataWrapper<Flat, OriginType, NonNullable<T>, PathVariablesType, Store> &
  DefaultValueable<Flat, OriginType, T, PathVariablesType, Store>;
