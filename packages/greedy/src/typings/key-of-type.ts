/***
 * This Type enables to extract the keynames of a type only of a certain base type.
 */
export type KeysOfType<T, TProp> = keyof Pick<
  T,
  { [K in keyof T]: T[K] extends TProp ? K : never }[keyof T]
>;
