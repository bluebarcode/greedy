import { TraversableGreedyType } from '..';
import { PathToken } from '../typings/path-token';
import { PathType } from '../typings/path-type';
import { flatten } from './flatten';
import { TokenType } from './token-type.enum';
import { handleArraySearchWithProperty2, handleSimpleArray2 } from './write';

const copyProperties = {
  from(source: any) {
    return {
      to(target: any) {
        Object.keys(target).forEach(key => (target[key] = source[key]));
      }
    };
  }
};
export class PathWizard {
  public static updatePath<A, C, OriginType, PathVariableType, Y>(
    path1: A extends TraversableGreedyType<
      infer T,
      infer Flat,
      OriginType,
      PathVariableType,
      infer Store
    >
      ? A
      : never,
    ...paths: (C extends TraversableGreedyType<
      infer T,
      infer Flat,
      OriginType,
      PathVariableType,
      infer Store
    >
      ? C
      : never)[] // ...allPaths: any[]
  ) {
    return {
      with: (
        baseEntity: OriginType,
        dynamicVariables?: PathVariableType
      ): OriginType => {
        [path1, ...paths].forEach((path, index) => {
          const tokens = path.$_$.finish().get();
          const store = {};
          //console.log('TOKENS', tokens);
          this.updatePathInternal(
            tokens,
            baseEntity,
            dynamicVariables,
            { $_$: store },
            baseEntity,
            ''
          );
        });
        return baseEntity;
      }
    };
  }

  static updatePathInternal(
    tokens: PathToken[],
    currentNode: any,
    dynamicVariables: any,
    store: any,
    originEntity: any,
    branchKey: string,
    functionList?: (() => void)[]
  ) {
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      if (typeof currentNode === 'undefined' || currentNode === null) {
        return;
        //currentNode = {}; // The traversal does not stop here - so we don´t loose any presessing steps that might come later (backToRoot)
      }
      if (!Array.isArray(token.property)) {
        if (TokenType.property === token.type) {
          if (
            typeof currentNode[token.property] === 'undefined' ||
            currentNode[token.property] === null
          ) {
            //currentNode[token.property] = token.defaultValue || {};
          } else if (token.unsetIfUnresolved) {
            const remainingTokens = tokens.slice(index + 1, tokens.length);
            const resolvedValue = this.getValueFromPath(
              remainingTokens,
              currentNode[token.property],
              dynamicVariables,
              originEntity,
              store
            );
            if (typeof resolvedValue === 'undefined') {
              currentNode[token.property] = undefined;
            }
          }
          currentNode = currentNode[token.property];
        }
        if (TokenType.array === token.type) {
          currentNode = handleSimpleArray2(currentNode, token);
        }
        if (TokenType.array_dynamic_index === token.type) {
          currentNode = handleSimpleArray2(currentNode, {
            ...token,
            index: dynamicVariables[token.index]
          });
        }
        if (TokenType.array_dynamic_root_index === token.type) {
          currentNode = handleArraySearchWithProperty2(
            currentNode,
            {
              ...token,
              index: originEntity[token.index]
            },
            store,
            branchKey
          );
        }
        if (TokenType.array_hardcoded_property === token.type) {
          currentNode = handleArraySearchWithProperty2(
            currentNode,
            token,
            store,
            branchKey
          );
        }
        if (TokenType.array_dynamic_property_index === token.type) {
          const dynamicIndex = { ...dynamicVariables, ...store }[token.index];
          currentNode = handleArraySearchWithProperty2(
            currentNode,
            {
              ...token,
              index: dynamicIndex
            },
            store,
            branchKey
          );
          branchKey += dynamicIndex;
        }
        if (TokenType.array_dynamic_root_property_index === token.type) {
          currentNode = handleArraySearchWithProperty2(
            currentNode,
            {
              ...token,
              index: originEntity[token.index]
            },
            store,
            branchKey
          );
        }
        if (token.type === TokenType.pipe) {
          if (token.pipe && token.pipe.length > 0) {
            for (
              let pipeIndex = 0;
              pipeIndex < token.pipe.length;
              pipeIndex++
            ) {
              if (
                typeof currentNode !== 'undefined' &&
                currentNode !== null &&
                token.pipe[pipeIndex]
              ) {
                if (
                  token.branchKey &&
                  { ...dynamicVariables, ...store }[token.branchKey]
                ) {
                  branchKey += { ...dynamicVariables, ...store }[
                    token.branchKey
                  ];
                }
                if (token.pipe[pipeIndex].data) {
                  const tp = token.pipe ? token.pipe[pipeIndex] : null;
                  currentNode =
                    tp && tp.data
                      ? tp.data(currentNode, {
                          path: dynamicVariables,
                          store: store
                        })
                      : currentNode;
                } else if (token.pipe[pipeIndex].store) {
                  const ts = token.pipe[pipeIndex].store;
                  if (ts) {
                    store = {
                      ...store,
                      ...ts(
                        { path: dynamicVariables, store: store },
                        currentNode
                      )
                    };
                  }
                }
              } else {
                return undefined;
              }
            }
          }
        }
        if (token.type === TokenType.ctrl_back_to_root) {
          currentNode = originEntity;
          branchKey = '';
        }
        if (
          [TokenType.array_filter, TokenType.array_all].includes(token.type)
        ) {
          const remainingTokens = tokens.slice(index + 1, tokens.length);
          const possibleArray = currentNode[token.property];

          const translatedValue = { ...dynamicVariables, ...store }[
            token.index
          ];
          if (possibleArray && Array.isArray(possibleArray)) {
            possibleArray
              .filter(entry => {
                if (token.entryProperty) {
                  return Boolean(
                    token.entryProperty &&
                      entry[token.entryProperty] === translatedValue
                  );
                }
                return true;
              })
              .forEach((entry, branchIdentifier) => {
                this.updatePathInternal(
                  remainingTokens,
                  entry,
                  dynamicVariables,
                  store,
                  originEntity,
                  branchKey +
                    (token.hashFunction !== undefined
                      ? token.hashFunction(entry)
                      : branchIdentifier)
                );
              });
          }
          index = Number.MAX_SAFE_INTEGER;
        }
      } else {
        token.property.forEach(property => {
          const remainingTokens = [
            { ...token, property },
            ...tokens.slice(index + 1, tokens.length)
          ];
          const uniteKey = token.uniteKey ? token.uniteKey : '';
          this.updatePathInternal(
            remainingTokens,
            currentNode,
            dynamicVariables,
            { ...store, [uniteKey]: property },
            originEntity,
            branchKey + property
          );
        });
        index = Number.MAX_SAFE_INTEGER;
      }
    }
  }
  static updatePathWithValue<T, inputType>(
    value: inputType,
    path: PathType<inputType>,
    baseEntity: T,
    dynamicVariables: any
  ): T {
    baseEntity = JSON.parse(JSON.stringify(baseEntity));
    const baseEntityAsAny: any = baseEntity;
    let currentNode: any = baseEntity;
    path.get().forEach((token, index) => {
      if (!Array.isArray(token.property)) {
        const isLast = index === path.get().length - 1;
        switch (token.type) {
          case TokenType.property: {
            if (isLast) {
              currentNode[token.property] = this.checkUndefinedElseDefault(
                value,
                token
              );
            } else {
              if (
                typeof currentNode[token.property] === 'undefined' ||
                currentNode[token.property] === null
              ) {
                currentNode[token.property] = token.defaultValue || {};
              }
              currentNode = currentNode[token.property];
            }
            break;
          }
          case TokenType.array: {
            currentNode = this.handleSimpleArray(currentNode, token);
            if (isLast) {
              copyProperties
                .from({ ...token.defaultValue, ...value })
                .to(currentNode);
            }
            break;
          }
          case TokenType.array_dynamic_index: {
            currentNode = this.handleSimpleArray(currentNode, {
              ...token,
              index: dynamicVariables[token.index]
            });
            if (isLast) {
              copyProperties.from(value).to(currentNode);
            }
            break;
          }
          case TokenType.array_dynamic_root_index: {
            currentNode = this.handleArraySearchWithProperty(currentNode, {
              ...token,
              index: baseEntityAsAny[token.index]
            });
            if (isLast) {
              copyProperties.from(value).to(currentNode);
            }
            break;
          }
          case TokenType.array_hardcoded_property: {
            currentNode = this.handleArraySearchWithProperty(
              currentNode,
              token
            );
            if (isLast) {
              copyProperties.from(value).to(currentNode);
            }
            break;
          }
          case TokenType.array_dynamic_property_index: {
            currentNode = this.handleArraySearchWithProperty(currentNode, {
              ...token,
              index: dynamicVariables[token.index]
            });
            if (isLast) {
              copyProperties.from(value).to(currentNode);
            }
            break;
          }
          case TokenType.array_dynamic_root_property_index: {
            currentNode = this.handleArraySearchWithProperty(currentNode, {
              ...token,
              index: baseEntityAsAny[token.index]
            });
            if (isLast) {
              copyProperties.from(value).to(currentNode);
            }
            break;
          }
        }
      }
    });
    return baseEntity;
  }

  static getValueFromPathify<ReturnType>(
    path: PathType<ReturnType>,
    baseEntity: any,
    dynamicValues: any
  ): ReturnType {
    const pathResult = PathWizard.getValueFromPath<ReturnType>(
      path.get(),
      baseEntity,
      dynamicValues,
      baseEntity,
      {}
    );
    return pathResult;
  }
  private static getFilterFunction(
    token: PathToken,
    storeAndpv: any
  ): (value: any) => boolean {
    if (token.entryProperty && token.index) {
      const filterValue = storeAndpv[token.index];
      const filterProperty = token.entryProperty;
      return (data: any): boolean => data[filterProperty] === filterValue;
    }
    return () => true;
  }
  private static getValueFromPath<T>(
    tokens: PathToken[],
    baseEntity: any,
    dynamicValues: any,
    originEntity: any,
    store: any
  ): T {
    let currentValue = baseEntity;
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      if (!Array.isArray(token.property)) {
        if (
          token.type === TokenType.array_filter ||
          token.type === TokenType.array_all
        ) {
          if (currentValue && Array.isArray(currentValue[token.property])) {
            const remainingTokens = tokens.slice(index + 1, tokens.length);
            currentValue = currentValue[token.property]
              .filter(
                this.getFilterFunction(token, { ...store, ...dynamicValues })
              )
              .map((entry: any) =>
                PathWizard.getValueFromPath(
                  remainingTokens,
                  entry,
                  dynamicValues,
                  originEntity,
                  store
                )
              );
            if (
              remainingTokens.find(entry =>
                [TokenType.array_all, TokenType.array_filter].includes(
                  entry.type
                )
              )
            ) {
              currentValue = flatten(currentValue);
            }
            index = tokens.length;
          } else {
            return <T>(<unknown>[]);
          }
        } else if (token.type === TokenType.ctrl_back_to_root) {
          currentValue = originEntity; // Reset to root element again - but the dynamic variables remain
        } else if (token.type === TokenType.reduce) {
          const remainingTokens = tokens.slice(index + 1, tokens.length);
          const resultToBeReduced = PathWizard.getValueFromPath(
            remainingTokens,
            currentValue,
            dynamicValues,
            originEntity,
            store
          );
          currentValue = (<any>resultToBeReduced)['reduce'](
            token.reducer,
            token.initialValue
          );
          return currentValue;
        } else if (token.type === TokenType.validIf) {
          currentValue = token.validator
            ? token.validator(currentValue, {
                path: dynamicValues,
                store
              })
            : currentValue;
        } else if (token.type === TokenType.pipe) {
          if (token.pipe && token.pipe.length > 0) {
            for (
              let pipeIndex = 0;
              pipeIndex < token.pipe.length;
              pipeIndex++
            ) {
              if (
                typeof currentValue !== 'undefined' &&
                currentValue !== null &&
                token.pipe[pipeIndex]
              ) {
                if (token.pipe[pipeIndex].data) {
                  const tp = token.pipe ? token.pipe[pipeIndex] : null;
                  currentValue =
                    tp && tp.data
                      ? tp.data(currentValue, {
                          path: dynamicValues,
                          store: store
                        })
                      : currentValue;
                } else if (token.pipe[pipeIndex].store) {
                  const ts = token.pipe[pipeIndex].store;
                  if (ts) {
                    store = {
                      ...store,
                      ...ts({ path: dynamicValues, store: store }, currentValue)
                    };
                  }
                }
              }
            }
          }
        } else if (
          typeof currentValue !== 'undefined' &&
          currentValue !== null
        ) {
          currentValue = this.getValueFromToken(
            currentValue,
            token,
            dynamicValues,
            store
          );
        } else {
          currentValue = token.defaultValue;
        }
      }
    }

    return currentValue;
  }
  private static getValueFromToken(
    currentValue: any,
    token: PathToken,
    dynamicValues: any,
    store: any
  ): any {
    if (!Array.isArray(token.property)) {
      switch (token.type) {
        case TokenType.property: {
          currentValue = currentValue[token.property];
          break;
        }
        case TokenType.array: {
          currentValue = currentValue[token.property][token.index];
          break;
        }
        case TokenType.array_dynamic_index: {
          const translatedValue = dynamicValues[token.index];
          if (
            translatedValue !== undefined &&
            currentValue[token.property] !== null
          ) {
            currentValue = currentValue[token.property][translatedValue];
          } else {
            currentValue = undefined;
          }
          break;
        }
        case TokenType.array_hardcoded_property: {
          currentValue = currentValue[token.property]
            ? (currentValue[token.property] as any[]).find(entry =>
                Boolean(
                  token.entryProperty &&
                    entry[token.entryProperty] === token.index
                )
              )
            : undefined;
          break;
        }
        case TokenType.array_dynamic_property_index: {
          const translatedValue = { ...dynamicValues, ...store }[token.index];
          if (
            currentValue[token.property] !== undefined &&
            currentValue[token.property] !== null
          ) {
            currentValue =
              (currentValue[token.property] as any[]).find(entry =>
                Boolean(
                  token.entryProperty &&
                    entry[token.entryProperty] === translatedValue
                )
              ) || undefined;
          }
          break;
        }
        case TokenType.property_dynamic: {
          currentValue = dynamicValues[token.property];
          break;
        }
      }
      return typeof currentValue !== 'undefined' && currentValue !== null
        ? currentValue
        : token.defaultValue;
    }
  }

  private static checkUndefinedElseDefault(
    valueToCheck: any,
    token: PathToken
  ) {
    return typeof valueToCheck !== 'undefined' && valueToCheck !== null
      ? valueToCheck
      : token.defaultValue;
  }

  private static handleArraySearchWithProperty(
    currentNode: any,
    parsedToken: any
  ) {
    if (
      currentNode[parsedToken.property] &&
      Array.isArray(currentNode[parsedToken.property])
    ) {
      let desiredEntry = (currentNode[parsedToken.property] as any[]).find(
        entry =>
          entry[parsedToken.entryProperty] === parsedToken.index ||
          entry[parsedToken.entryProperty] === +parsedToken.index
      );
      if (!desiredEntry) {
        desiredEntry =
          typeof parsedToken.defaultValue !== 'undefined'
            ? parsedToken.defaultValue
            : {};
        desiredEntry[parsedToken.entryProperty] = parsedToken.index;
        (currentNode[parsedToken.property] as any[]).push(desiredEntry);
      }
      currentNode = desiredEntry;
    } else if (currentNode[parsedToken.property]) {
      // This means it is no array! and we will not override it
      console.error('This is no Array!:', currentNode[parsedToken.property]);
    } else {
      currentNode = currentNode[parsedToken.property] = [];
      const newNode =
        typeof parsedToken.defaultValue !== 'undefined'
          ? parsedToken.defaultValue
          : {};
      newNode[parsedToken.entryProperty] = parsedToken.index;
      currentNode.push(newNode);
      currentNode = newNode;
    }
    return currentNode;
  }

  private static handleSimpleArray(currentNode: any, parsedToken: PathToken) {
    if (!Array.isArray(parsedToken.property)) {
      if (
        currentNode[parsedToken.property] &&
        Array.isArray(currentNode[parsedToken.property])
      ) {
        if (!currentNode[parsedToken.property][parsedToken.index]) {
          currentNode[parsedToken.property][parsedToken.index] =
            typeof parsedToken.defaultValue !== 'undefined'
              ? parsedToken.defaultValue
              : {};
        }
        currentNode = currentNode[parsedToken.property][parsedToken.index];
      } else if (currentNode[parsedToken.property]) {
        // This means it is no array! and we will not override it
        console.error('This is no Array!:', currentNode[parsedToken.property]);
      } else {
        // It´s empty -> new array with new entry
        currentNode = currentNode[parsedToken.property] = [];
        currentNode = currentNode[parsedToken.index] =
          typeof parsedToken.defaultValue !== 'undefined'
            ? parsedToken.defaultValue
            : {};
      }
    }
    return currentNode;
  }
}
