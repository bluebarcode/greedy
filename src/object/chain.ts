import { TraversablePathType } from './models/traversable-path.type';
import { oc } from './path-wizard-pathify';

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
  basePath: TraversablePathType<BT, BFlat, BOrigin, BPV, BStore>,
  extensionPath: TraversablePathType<ET, EFlat, EOrigin, EPV, EStore>
): TraversablePathType<
  ET,
  EFlat extends true ? (BFlat extends true ? true : false) : false,
  BOrigin,
  EPV & BPV,
  BStore & EStore
> => {
  // Let´s hope that the current Token is not necessary (it would only be necessary if the user directly calls a function after combine.)
  const extensionTokens = extensionPath.$_$.finish().get();
  const currentToken = extensionTokens.slice(
    extensionTokens.length - 1,
    extensionTokens.length
  );
  return oc(
    basePath.$_$.finish()
      .get()
      .concat(extensionPath.$_$.finish().get()),
    currentToken[0],
    currentToken[0].property
  ) as TraversablePathType<
    ET,
    EFlat extends true ? (BFlat extends true ? true : false) : false,
    BOrigin,
    EPV & BPV,
    BStore & EStore
  >;
};
