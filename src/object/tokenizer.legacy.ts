import { PathToken } from './models/path-token';
import { TokenType } from './models/token-type.enum';

export function parseToken(token: string): PathToken {
  let property = token;
  let entryProperty = '';
  let index;
  if (token.includes('[')) {
    const tokenMatch = token.match(/\[([^)]+)\]/);
    index = tokenMatch && tokenMatch.length > 1 ? tokenMatch[1] : '';
    property = token.split('[')[0];
    if (index.includes('=')) {
      entryProperty = index.split('=')[0];
      index = index.split('=')[1];
      if (index.includes('$')) {
        return {
          type: TokenType.array_dynamic_property_index,
          property,
          index: index.toString().replace('$', ''),
          entryProperty
        };
      } else if (index.includes('§')) {
        return {
          type: TokenType.array_dynamic_root_property_index,
          property,
          index: index.toString().replace('§', ''),
          entryProperty
        };
      } else {
        return {
          type: TokenType.array_hardcoded_property,
          property,
          index,
          entryProperty
        };
      }
    } else if (index.includes('$')) {
      return {
        type: TokenType.array_dynamic_index,
        property,
        index: index.toString().replace('$', '')
      };
    } else if (index.includes('§')) {
      return {
        type: TokenType.array_dynamic_root_index,
        property,
        index: index.toString().replace('§', '')
      };
    } else {
      return { type: TokenType.array, property, index };
    }
  } else {
    if (token.includes('$')) {
      return {
        type: TokenType.property_dynamic,
        property: property.replace('$', '')
      };
    }
    return { type: TokenType.property, property };
  }
}
