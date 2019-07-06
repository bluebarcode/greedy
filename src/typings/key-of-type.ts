export type KeysOfType<T, TProp> = keyof Pick<
  T,
  { [K in keyof T]: T[K] extends TProp ? K : never }[keyof T]
>;
