import { of } from 'rxjs';
import { mapPath } from '../../packages/greedy-rxjs/src/rxjs/pathify.rxjs';
import { ObjectPath } from '../../packages/greedy/src';
import { unitTestProjectData } from './data/pm/pm.data';
import { Project } from './data/pm/pm.types';

interface Variables {
  moduleId: number;
}
describe('Pathify', () => {
  it('RX JS Read', () => {
    const stream = of(unitTestProjectData);
    const path = new ObjectPath<Project, Variables>().start.modules(
      'id',
      'moduleId'
    );
    const pathifiedStream = stream.pipe(
      mapPath(path.$_$.finish(), { moduleId: 1 })
    );
    pathifiedStream.subscribe(result => {
      expect(result.name).toEqual('Backend');
    });
  });
});
