import { TraversableGreedyType } from '../typings/traversable-greedy.type';
import { proxy } from './path-wizard-pathify';

export const chain = <
  BT,
  BFlat,
  BOrigin,
  BPV,
  ET,
  EFlat,
  EOrigin,
  EPV,
  BStore,
  EStore
>(
  basePath: TraversableGreedyType<BT, BFlat, BOrigin, BPV, BStore>,
  extensionPath: TraversableGreedyType<ET, EFlat, EOrigin, EPV, EStore>
): TraversableGreedyType<
  ET,
  EFlat extends true ? (BFlat extends true ? true : false) : false,
  BOrigin,
  EPV & BPV,
  BStore & EStore
> => {
  // Let´s hope that the current Token is not necessary (it would only be necessary if the user directly calls a function after combine.)
  const extensionTokens = extensionPath.$token;
  const currentToken = extensionTokens.slice(
    extensionTokens.length - 1,
    extensionTokens.length
  );

  /**
   * @todo
   * any => workaround for error:
   * "Type instantiation is excessively deep and possibly infinite."
   */
  return proxy(
    basePath.$token.concat(extensionPath.$token),
    currentToken[0],
    Array.isArray(currentToken[0].property) ? '' : currentToken[0].property
  ) as any; /*TraversablePathType<
    ET,
    EFlat extends true ? (BFlat extends true ? true : false) : false,
    BOrigin,
    EPV & BPV,
    BStore & EStore
  >;*/
};
