import { KeysOfType } from './key-of-type';
import { SpecialOperations } from './special-operations';

type ObjectWrapper<Flat, OriginType, T, PathVariablesType, Store> = {
  [K in keyof T]-?: TraversablePathType<
    T[K],
    Flat,
    OriginType,
    PathVariablesType,
    Store
  >
};

interface All<Flat, OriginType, T, PathVariablesType, Store> {
  $_$: SpecialOperations<Flat, OriginType, T, PathVariablesType, Store>;
}

type DefaultValueable<Flat, OriginType, T, PathVariables, Store> = (
  defaultVal: T
) => TraversablePathType<T, Flat, OriginType, PathVariables, Store>;

interface ArrayWrapper<Flat, OriginType, T, PathVariablesType, Store> {
  length: TraversablePathType<number, Flat, OriginType, PathVariablesType>;
  [K: number]: TraversablePathType<T, Flat, OriginType, PathVariablesType>;
  (
    filterKey: keyof T,
    filterValue: keyof PathVariablesType | keyof Store
  ): TraversablePathType<T, Flat, OriginType, PathVariablesType, Store>;
  arrayIndex(
    index: KeysOfType<PathVariablesType, number>
  ): TraversablePathType<T, Flat, OriginType, PathVariablesType, Store>;
  all(
    hash?: (object: T) => string | null
  ): TraversablePathType<T, false, OriginType, PathVariablesType, Store>;
  filter(
    filterKey: keyof T,
    filterValue: keyof PathVariablesType | keyof Store
  ): TraversablePathType<T, false, OriginType, PathVariablesType, Store>;
}

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

export type TraversablePathType<
  T,
  Flat = false,
  OriginType = any,
  PathVariablesType = any,
  Store = any
> = All<Flat, OriginType, T, PathVariablesType, Store> &
  DataWrapper<Flat, OriginType, NonNullable<T>, PathVariablesType, Store> &
  DefaultValueable<Flat, OriginType, T, PathVariablesType, Store>;
