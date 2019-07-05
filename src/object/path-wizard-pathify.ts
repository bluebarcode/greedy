import { PathToken } from './models/path-token';
import { PathType, ValidationType } from './models/path-type';
import { SpecialOperations } from './models/special-operations';
import { TokenType } from './models/token-type.enum';
import {
  StateValues,
  TraversablePathType
} from './models/traversable-path.type';

class Greedy<Flat, OriginType, T, PathVariablesType, Store>
  implements SpecialOperations<Flat, OriginType, T, PathVariablesType, Store> {
  constructor(
    private previousTokens: PathToken[],
    private currentToken: PathToken | undefined
  ) {}
  finish(): PathType<any> {
    const previousTokens = this.previousTokens;
    return {
      get() {
        return previousTokens;
      }
    };
  }
  pipe(...transformators: ((data: any) => any)[]): any {
    if (this.currentToken && this.currentToken.type !== TokenType.pipe) {
      this.currentToken = { property: '', type: TokenType.pipe };
      this.previousTokens = [...this.previousTokens, this.currentToken];
    }
    if (this.currentToken) {
      this.currentToken.type = TokenType.pipe;
    }
    let param = (oc(
      this.previousTokens,
      this.currentToken
    ) as unknown) as TraversablePathType<
      T,
      Flat,
      OriginType,
      PathVariablesType
    >;
    transformators.forEach(transformator => (param = transformator(param)));
    return param;
  }
  backToRoot(): TraversablePathType<
    OriginType,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  > {
    this.currentToken = { property: '', type: TokenType.ctrl_back_to_root };
    this.previousTokens = [...this.previousTokens, this.currentToken];
    return (oc(
      this.previousTokens,
      this.currentToken
    ) as unknown) as TraversablePathType<
      OriginType,
      Flat,
      OriginType,
      PathVariablesType,
      Store
    >;
  }
  validIf(
    validator: (
      value: T,
      pathVariables: StateValues<PathVariablesType, Store>
    ) => boolean
  ): Flat extends true ? PathType<boolean> : ValidationType<boolean> {
    let previousTokens = this.previousTokens;
    previousTokens = [
      ...previousTokens,
      { type: TokenType.validIf, property: '', validator: validator }
    ];
    return {
      get() {
        return previousTokens;
      },
      reduce(reducer, initialValue) {
        return {
          get() {
            return [
              { property: '', type: TokenType.reduce, reducer, initialValue },
              ...previousTokens
            ];
          }
        };
      }
    } as Flat extends true ? PathType<boolean> : ValidationType<boolean>;
  }
  removeIfUnvisited(): TraversablePathType<
    T,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  > {
    if (this.currentToken) {
      this.currentToken.removeIfUndefined = true;
    }
    const param = (oc(
      this.previousTokens,
      this.currentToken
    ) as unknown) as TraversablePathType<
      T,
      Flat,
      OriginType,
      PathVariablesType
    >;
    return param;
  }
  unsetIfUnresolved(): TraversablePathType<
    T,
    Flat,
    OriginType,
    PathVariablesType,
    Store
  > {
    if (this.currentToken) {
      this.currentToken.unsetIfUnresolved = true;
    }
    const param = (oc(
      this.previousTokens,
      this.currentToken
    ) as unknown) as TraversablePathType<
      T,
      Flat,
      OriginType,
      PathVariablesType
    >;
    return param;
  }
}

/**
 * Takes an object of a specific type (The object itself is not used at all)
 * and lets you traverse until you call finish() to retrieve the relational path from you initial type as string.
 * You can add filter (key,value) to further traverse through array properties.
 * Keep in mind - As this returns a function, it will not work in Observables - but it will in Subjects.
 * @param data The data object that detrmines the base Type
 */

export const pathify = <T, PathVariablesType = any>(
  data: T,
  pathVariables?: PathVariablesType
) => {
  return oc<T, PathVariablesType>([]);
};

const hash = (object: any): string => {
  const stringified = JSON.stringify(object);
  return stringified
    .split('')
    .reduce(function(a, b) {
      // tslint:disable-next-line:no-bitwise
      a = (a << 5) - a + b.charCodeAt(0);
      // tslint:disable-next-line:no-bitwise
      return a & a;
    }, 0)
    .toString();
};
export function oc<ocT, PathVariablesType>(
  previousTokens: PathToken[],
  currentToken?: PathToken,
  propertyName?: string | number | symbol
): TraversablePathType<ocT, true, ocT, PathVariablesType> {
  const localTokens = previousTokens;
  return new Proxy(
    /**
     * @todo
     * @refactor
     * needs to be checked when strict is on
     */
    // @ts-ignore
    ((arg1: string, arg2: string) => {
      if (propertyName === 'arrayIndex') {
        // Indexed array
        if (currentToken) {
          currentToken.type = TokenType.array_dynamic_index;
          currentToken.index = arg1;
        }
        return oc(previousTokens, currentToken);
      } else if (propertyName === 'all') {
        // Map to all Array
        if (currentToken) {
          currentToken.type = TokenType.array_all;
          currentToken.hashFunction = <any>arg1;
        }
        return oc(previousTokens, currentToken);
      } else if (propertyName === 'filter') {
        // Map to filtered array
        if (currentToken) {
          currentToken.type = TokenType.array_filter;
          currentToken.entryProperty = arg1;
          currentToken.index = arg2;
        }
        return oc(previousTokens, currentToken);
      } else if (propertyName === 'finish') {
        // finish call
        return localTokens;
      } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
        // Filter an array via key & Path Variable
        if (currentToken) {
          currentToken.type = TokenType.array_dynamic_property_index;
          currentToken.entryProperty = arg1;
          currentToken.index = arg2;
        }
        return oc(previousTokens, currentToken);
      } else if (typeof arg1 !== 'undefined') {
        // Set Default value
        if (currentToken) {
          currentToken.defaultValue = arg1;
        }
        return oc(previousTokens, currentToken, propertyName);
      } else {
        return oc(previousTokens, currentToken, propertyName); // Property access
      }
    }) as TraversablePathType<ocT, true, ocT, PathVariablesType>,
    {
      get: (target, key) => {
        if (
          key === 'finish' ||
          key === 'arrayIndex' ||
          key === 'all' ||
          key === 'filter'
        ) {
          return oc(previousTokens, currentToken, key);
        } else if (key === '$_$') {
          const newGreedyObj = new Greedy(previousTokens, currentToken);
          return newGreedyObj; // Muss gebindet sein sonst wird die funktion vom Proxy aus aufgerufen - besser wäre hier eigentlich das Objekt als ganzes zurückzugeben und dann den User callen zu lassen, aber die Typisierung von Typescript bekommt hier ein Problem
        }
        const newToken = {
          property: key.toString(),
          type: TokenType.property
        };
        return oc([...previousTokens, newToken], newToken);
      }
    }
  );
}
