import { TraversableGreedyType } from '../typings/traversable-greedy.type';
import { PathWizard } from './path-wizard';

type compatibleType<FirstFlat, SecondFlat, T> = FirstFlat extends SecondFlat
  ? T
  : FirstFlat extends false
  ? T[]
  : T extends any[]
  ? T[number]
  : T;

export const does = <T, FirstFlat, FirstOrigin, FirstPV = void>(
  firstPath: TraversableGreedyType<T, FirstFlat, FirstOrigin, FirstPV>
) => ({
  equal: <SecondOrigin, SecondFlat, SecondPV = void>(
    secondPath: TraversableGreedyType<
      compatibleType<FirstFlat, SecondFlat, T>,
      SecondFlat,
      SecondOrigin,
      SecondPV
    >
  ) => ({
    for: (
      firstEntity: { entity: FirstOrigin; pathVariables?: FirstPV },
      secondEntity: { entity: SecondOrigin; pathVariables?: SecondPV },
      comparisonFunction: (
        first: FirstFlat extends true ? T : T[],
        Second: SecondFlat extends true
          ? NonNullable<compatibleType<FirstFlat, SecondFlat, T>>
          : NonNullable<compatibleType<FirstFlat, SecondFlat, T>>[]
      ) => boolean
    ): boolean => {
      const firstResult = PathWizard.getValueFromPathify(
        firstPath.$_$.finish(),
        firstEntity.entity,
        firstEntity.pathVariables
      );
      const secondResult = PathWizard.getValueFromPathify(
        secondPath.$_$.finish(),
        secondEntity.entity,
        secondEntity.pathVariables
      );
      return comparisonFunction(firstResult, secondResult);
    }
  })
});
