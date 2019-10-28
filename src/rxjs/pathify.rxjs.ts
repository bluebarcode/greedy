import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PathType, PathWizard } from '..';

export const mapPath = <ReturnType, InputType, Flat, PathVariables, Store>(
  path: PathType<ReturnType, InputType, PathVariables>,
  variables: PathVariables
) => (source: Observable<InputType>) => {
  return source.pipe(
    map(input => {
      return PathWizard.getValueFromPathify(path, input, variables);
    })
  );
};
