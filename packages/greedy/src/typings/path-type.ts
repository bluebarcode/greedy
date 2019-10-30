import { PathToken } from './path-token';

export interface PathType<ReturnType, InputType = any, PathVariables = any> {
  get(): PathToken[];
}

export interface ValidationType<Flat> extends PathType<boolean> {
  reduce(
    func: (previous: boolean, current: boolean) => boolean,
    initialValue: boolean
  ): PathType<boolean>;
}
