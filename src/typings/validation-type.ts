import { PathType } from './path-type';

export interface ValidationType<Flat> extends PathType<boolean> {
  reduce(
    func: (previous: boolean, current: boolean) => boolean,
    initialValue: boolean
  ): PathType<boolean>;
}
