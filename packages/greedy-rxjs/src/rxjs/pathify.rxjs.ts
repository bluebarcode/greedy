import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PathWizard } from '../../../greedy/src';
import { Endpoint } from '../../../greedy/src/typings/traversable-greedy.type';

export const mapPath = <ReturnType, InputType, Flat, PathVariables, Store>(
  path: Endpoint<Flat, InputType, ReturnType, PathVariables>,
  variables: PathVariables
) => (source: Observable<InputType>) => {
  return source.pipe(
    map(input => {
      return PathWizard.getValueFromPathify(path, input, variables);
    })
  );
};
