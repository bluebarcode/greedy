import { proxy } from '../implementation/path-wizard-pathify';
import { TokenType } from '../implementation/token-type.enum';
import { PathToken } from '../typings/path-token';
import { currentToken, OpFunc } from '../typings/special-operations';
import { StateValues } from '../typings/state-values';

export function $store<T, Flat, PathVariables, StoreIn, StoreOut, OriginType>(
  storeFunc: (
    pathVariables: StateValues<PathVariables, StoreIn>,
    value: T
  ) => StoreOut
): OpFunc<
  T,
  T,
  Flat,
  Flat,
  PathVariables,
  StoreIn,
  0 extends (1 & StoreIn) ? StoreOut : StoreIn & StoreOut,
  OriginType
> {
  return sourcePathType => {
    const tokens = currentToken(sourcePathType);
    const newToken: PathToken = {
      property: '',
      type: TokenType.pipe,
      pipe: [{ store: storeFunc }]
    };
    const result = proxy([...tokens.tokens, newToken], newToken, undefined);
    // @ts-ignore
    return result as TraversableGreedyType<
      T,
      Flat,
      OriginType,
      PathVariables,
      0 extends (1 & StoreIn) ? StoreOut : StoreIn & StoreOut
    >;
  };
}

const project1 = {
  projectId: 1,
  name: 'Project 1',
  modules: [
    {
      id: 1,
      name: 'Backend',
      budget: 1000,
      dueDate: '12-01-2020',
      tasks: [
        {
          id: 1,
          name: 'Database',
          status: 'closed',
          startDate: '20-11-2019',
          assignee: 4
        },
        {
          id: 2,
          name: 'ORM',
          status: 'running',
          startDate: '20-11-2019',
          assignee: 3
        },
        {
          id: 3,

          name: 'Http',
          status: 'open',
          startDate: '24-12-2019',
          assignee: 2
        }
      ]
    },
    { id: 2, name: 'Frontend', budget: 2000, dueDate: '24-03-2020' },
    { id: 3, name: 'Reporting', budget: 10000, dueDate: '28-12-2024' }
  ]
};

'modules[id=$moduleId].tasks[id=$taskId].status';
