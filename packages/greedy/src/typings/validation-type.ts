import { Endpoint } from './traversable-greedy.type';

export interface ValidationType<Flat> {
  reduce(
    func: (previous: boolean, current: boolean) => boolean,
    initialValue: boolean
  ): Endpoint<Flat, any, boolean>;
}
