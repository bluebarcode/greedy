import { $store, ObjectPath, PathWizard } from '../../packages/greedy/src';
import { Deathstar1 } from './data/party/party-data';
import { Party } from './data/party/party-types';

describe('Pathify', () => {
  it('Consistency - remove if unvisited', () => {
    const basePath = new ObjectPath<Party, {}>();
    const consistencyEnsuredPath = basePath.start.participants
      .all()
      .$_$.pipe(
        $store((pv, val) => {
          return { participant: val.name };
        })
      )
      .$_$.backToRoot()
      .suppliers('supplier', 'participant')
      .$_$.removeIfUnvisited();
    const result = PathWizard.updatePath(consistencyEnsuredPath).with(
      Deathstar1
    );
    expect(result.suppliers.length).toBe(2); // One of the suppliers (JarJar) Did cancel his invitatio so - he cannot be a supplier anymore.
  });
});
