import { Endpoint } from '../typings/traversable-greedy.type';
import { PathWizard } from './path-wizard';

type compatibleType<FirstFlat, SecondFlat, T> = FirstFlat extends SecondFlat
  ? T
  : FirstFlat extends false
  ? T[]
  : T extends any[]
  ? T[number]
  : T;

export const does = <T, FirstFlat, FirstOrigin, FirstPV = void>(
  firstPath: Endpoint<FirstFlat, FirstOrigin, T, FirstPV>
) => ({
  equal: <SecondOrigin, SecondFlat, SecondPV = void>(
    secondPath: Endpoint<SecondFlat, SecondOrigin, T, SecondPV>
  ) => ({
    for: (
      firstEntity: { entity: FirstOrigin; pathVariables?: FirstPV },
      secondEntity: { entity: SecondOrigin; pathVariables?: SecondPV },
      comparisonFunction: (
        first: FirstFlat extends true ? T : T[],
        Second: SecondFlat extends true ? T : T[]
      ) => boolean
    ): boolean => {
      const firstResult = PathWizard.getValueFromPathify(
        firstPath,
        firstEntity.entity,
        firstEntity.pathVariables
      );
      const secondResult = PathWizard.getValueFromPathify(
        secondPath,
        secondEntity.entity,
        secondEntity.pathVariables
      );
      return comparisonFunction(firstResult, secondResult);
    }
  })
});
