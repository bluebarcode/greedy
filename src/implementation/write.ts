import { PathToken } from '../typings/path-token';

export const handleArraySearchWithProperty2 = (
  currentNode: any,
  token: PathToken,
  store: any,
  branchKey: string
) => {
  if (!Array.isArray(token.property)) {
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
      let desiredEntry;
      if (token.keepIf) {
        desiredEntry = (originalArray as any[]).filter(entry =>
          token.keepIf
            ? token.keepIf(entry, { path: store, store: store })
            : false
        );
      } else {
        desiredEntry = (originalArray as any[]).filter(
          entry =>
            entry[token.entryProperty as string] === token.index ||
            entry[token.entryProperty as string] === +token.index
        );
      }
      if (desiredEntry && token.removeIfUndefined) {
        for (let index = 0; index < desiredEntry.length; index++) {
          if (currentNode[token.property].indexOf(desiredEntry[index]) === -1) {
            currentNode[token.property].push(desiredEntry[index]);
          }
        }
      }
      currentNode = desiredEntry.length > 0 ? desiredEntry[0] : desiredEntry;
    }
  }
  return currentNode;
};
export const handleSimpleArray2 = (currentNode: any, token: PathToken) => {
  if (!Array.isArray(token.property)) {
    if (
      currentNode[token.property] &&
      Array.isArray(currentNode[token.property])
    ) {
      currentNode = currentNode[token.property][token.index];
    } else if (currentNode[token.property]) {
      // This means it is no array! and we will not override it
      console.error('This is no Array!:', currentNode[token.property]);
    }
  }
  return currentNode;
};
