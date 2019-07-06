import { PathToken } from './path-token';

export interface PathType<ReturnType> {
  get(): PathToken[];
}
