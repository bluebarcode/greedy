import { PathToken } from './models/path-token';

export const handleArraySearchWithProperty2 = (
  currentNode: any,
  token: PathToken,
  store: any,
  branchKey: string
) => {
  if (
    currentNode[token.property] &&
    Array.isArray(currentNode[token.property])
  ) {
    let originalArray = currentNode[token.property];
    if (token.removeIfUndefined) {
      if (!store.$_$[branchKey]) {
        // original array not yet stored
        // first apperence on this array
        store.$_$[branchKey] = originalArray;
        currentNode[token.property] = [];
      } else {
        originalArray = store.$_$[branchKey];
      }
    }
    const desiredEntry = (originalArray as any[]).find(
      entry =>
        entry[token.entryProperty as string] === token.index ||
        entry[token.entryProperty as string] === +token.index
    );
    if (desiredEntry && token.removeIfUndefined) {
      currentNode[token.property].push(desiredEntry);
    }
    currentNode = desiredEntry;
  }
  return currentNode;
};
export const handleSimpleArray2 = (
  currentNode: any,
  parsedToken: PathToken
) => {
  if (
    currentNode[parsedToken.property] &&
    Array.isArray(currentNode[parsedToken.property])
  ) {
    currentNode = currentNode[parsedToken.property][parsedToken.index];
  } else if (currentNode[parsedToken.property]) {
    // This means it is no array! and we will not override it
    console.error('This is no Array!:', currentNode[parsedToken.property]);
  }
  return currentNode;
};
