import { PathWizard } from '../../packages/greedy/src';
import { chain } from '../../packages/greedy/src/implementation/chain';
import { does } from '../../packages/greedy/src/implementation/equals';
import { ObjectPath } from '../../packages/greedy/src/implementation/object-path.class';
import { $map } from '../../packages/greedy/src/operators/map';
import { $store } from '../../packages/greedy/src/operators/store';
import { unitTestProjectData } from './data/pm/pm.data';
import { EStatus, Module, Project } from './data/pm/pm.types';

describe('Pathify Read', () => {
  it('Unfiltered Array', () => {
    const test = new ObjectPath<Project>();
    const mappedStringProperty = test.start.modules
      .all()
      .tasks.all()
      .status.$_$.finish();
    const arrayResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      unitTestProjectData,
      undefined
    );
    expect(arrayResult).toEqual([
      EStatus.closed,
      EStatus.running,
      EStatus.open
    ]);
  });
});

describe('Pathify Read', () => {
  it('Map function', () => {
    const test = new ObjectPath<Project>();
    const mappedStringProperty = test.start.modules
      .all()
      .tasks.all()
      .assignee.$_$.pipe($map(assigneeId => assigneeId + 1))
      .$_$.finish();
    const stringResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      unitTestProjectData,
      undefined
    );
    expect(stringResult).toEqual([5, 4, 3]);
  });
});

describe('Pathify Read', () => {
  it('Chain', () => {
    const basePath = new ObjectPath<Project>();
    const baseProperty = basePath.start.modules.all();
    const extensionPath = new ObjectPath<Module>().start.tasks.all().assignee;
    const combinedPath = chain(baseProperty, extensionPath).$_$.finish(); // Must be string[]!!!
    const stringResult = PathWizard.getValueFromPathify(
      combinedPath,
      unitTestProjectData,
      undefined
    );
    expect(stringResult).toEqual([4, 3, 2]);
  });
});
describe('Pathify Read', () => {
  it('Store function', () => {
    const test = new ObjectPath<Project>();
    const mappedStringProperty = test.start.modules
      .all()
      .tasks.all()
      .status.$_$.pipe(
        $store((pv, val) => {
          return { status: val };
        }),
        $map((val, pv) => [pv.store.status])
      )
      .$_$.finish();
    const stringResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      unitTestProjectData,
      undefined
    );
    expect(stringResult).toEqual([
      [EStatus.closed],
      [EStatus.running],
      [EStatus.open]
    ]);
  });
});

describe('Pathify Read', () => {
  it('Equals function', () => {
    const test = new ObjectPath<Project>();
    const firstPath = test.start.modules
      .all()
      .tasks.all()
      .assignee.$_$.pipe(
        $store((pv, val) => {
          return { aapArr: val };
        }),
        $map((val, pv) => 1)
      );
    const secondPath = test.start.modules
      .all()
      .tasks.all()
      .$_$.pipe($map(data => 1));

    const result = does(firstPath)
      .equal(secondPath)
      .for(
        { entity: unitTestProjectData },
        { entity: unitTestProjectData },
        (f, s) => true
      );
    expect(result).toBeTruthy();
  });
});

describe('Pathify Read', () => {
  it('Store & Back to root function', () => {
    const test = new ObjectPath<Project>();
    const firstPath = test.start.modules
      .all()
      .tasks.all()
      .assignee.$_$.pipe(
        $store((pv, val) => {
          return { aapArr: val };
        })
      )
      .$_$.backToRoot().name;
    const result = PathWizard.getValueFromPathify(
      firstPath.$_$.finish(),
      unitTestProjectData,
      undefined
    );
    expect(result).toEqual(['Project 1', 'Project 1', 'Project 1']);
  });
});

describe('Pathify Read', () => {
  it('Validate Simple', () => {
    const test = new ObjectPath<Project>();
    const simpleValidation = test.start.name.$_$.validIf(
      (value, pv) => value === unitTestProjectData.name
    );
    const result = PathWizard.getValueFromPathify(
      simpleValidation,
      unitTestProjectData,
      undefined
    );
    expect(result).toBeTruthy();
  });
});
describe('Pathify Read', () => {
  it('Validate & Reduce', () => {
    const test = new ObjectPath<Project>();
    const path = test.start.modules
      .all()
      .tasks.all()
      .$_$.validIf((value, pv) => typeof value.assignee !== 'undefined');
    const result = PathWizard.getValueFromPathify(
      path.reduce((previous, current) => previous && current, true),
      unitTestProjectData,
      undefined
    );
    expect(result).toBeTruthy();
  });
});
