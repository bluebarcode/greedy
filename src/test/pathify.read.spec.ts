import { PathWizard } from '..';
import { chain } from '../implementation/chain';
import { does } from '../implementation/equals';
import { ObjectPath } from '../implementation/object-path.class';
import { $map } from '../operators/map';
import { $store } from '../operators/store';

interface TestInterface {
  rootString: string;
  rootArray: RootArrayType[];
}

interface RootArrayType {
  arrayProp1: string;
  arrayProp2: string;
  arrayArray: {
    arrayArrayProp1: string;
    arrayArrayProp2: number;
    arrayArrayArray: string[];
  }[];
}

const testInterfaceImplementation: TestInterface = {
  rootArray: [
    <RootArrayType>{
      arrayArray: [
        {
          arrayArrayProp1: 'aap1',
          arrayArrayProp2: 1,
          arrayArrayArray: ['hans!']
        }
      ],
      arrayProp1: 'arrProp11',
      arrayProp2: 'arrProp12'
    },
    <RootArrayType>{
      arrayArray: [
        { arrayArrayProp1: 'aap2', arrayArrayProp2: 2, arrayArrayArray: [] }
      ],
      arrayProp1: 'arrProp21',
      arrayProp2: 'arrProp22'
    }
  ],
  rootString: 'rootString'
};
// describe('Pathify', () => {
//   it('Filtered array', () => {
//     const test = new ObjectPath<TestInterface>();
//     const basePath = test.start.rootArray
//       .filter('arrayProp1', 'arrProp1')
//       .arrayArray.all();
//     const mappedStringProperty = basePath.arrayArrayProp1.$_$.finish();
//     const stringResult = PathWizard.getValueFromPathify(
//       mappedStringProperty,
//       testInterfaceImplementation,
//       undefined
//     );
//     expect(stringResult).toEqual(['aap2']);
//     const mappedNumberProperty = basePath.arrayArrayProp2.$_$.finish();
//     const numberResult = PathWizard.getValueFromPathify(
//       mappedNumberProperty,
//       testInterfaceImplementation,
//       undefined
//     );
//     expect(numberResult).toEqual([2]);
//   });
// });
describe('Pathify', () => {
  it('Unfiltered Array', () => {
    const test = new ObjectPath<TestInterface>();
    const mappedStringProperty = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp1.$_$.finish();
    const stringResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      testInterfaceImplementation,
      undefined
    );
    expect(stringResult).toEqual(['aap1', 'aap2']);
    const mappedNumberProperty = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp2.$_$.finish();
    const numberResult = PathWizard.getValueFromPathify(
      mappedNumberProperty,
      testInterfaceImplementation,
      undefined
    );
    expect(numberResult).toEqual([1, 2]);
  });
});
describe('Pathify', () => {
  it('Map function', () => {
    const test = new ObjectPath<TestInterface>();
    const mappedStringProperty = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp1.$_$.pipe($map(data => [data + 'hans!']))
      .$_$.finish();
    const stringResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      testInterfaceImplementation,
      undefined
    );
    expect(stringResult).toEqual([['aap1hans!'], ['aap2hans!']]);
  });
});
describe('Pathify', () => {
  it('Chain', () => {
    const basePath = new ObjectPath<TestInterface>();
    const baseProperty = basePath.start.rootArray.all();
    const extensionPath = new ObjectPath<RootArrayType>().start.arrayArray.all()
      .arrayArrayProp2;
    const combinedPath = chain(baseProperty, extensionPath).$_$.finish(); // Must be string[]!!!
    const stringResult = PathWizard.getValueFromPathify(
      combinedPath,
      testInterfaceImplementation,
      undefined
    );
    expect(stringResult).toEqual([1, 2]);
  });
});
describe('Pathify', () => {
  it('Store function', () => {
    const test = new ObjectPath<TestInterface>();
    const mappedStringProperty = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp1.$_$.pipe(
        $store((pv, val) => {
          return { aapArr: val };
        }),
        $map((val, pv) => [pv.store.aapArr])
      )
      .$_$.finish();
    const stringResult = PathWizard.getValueFromPathify(
      mappedStringProperty,
      testInterfaceImplementation,
      undefined
    );
    expect(stringResult).toEqual([['aap1'], ['aap2']]);
  });
});

describe('Pathify', () => {
  it('Equals function', () => {
    const test = new ObjectPath<TestInterface>();
    const firstPath = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp1.$_$.pipe(
        $store((pv, val) => {
          return { aapArr: val };
        }),
        $map((val, pv) => 1)
      );
    const secondPath = test.start.rootArray
      .all()
      .arrayArray.all()
      .$_$.pipe($map(data => 1));

    const result = does(firstPath)
      .equal(secondPath)
      .for(
        { entity: testInterfaceImplementation },
        { entity: testInterfaceImplementation },
        (f, s) => true
      );
    expect(result).toBeTruthy();
  });
});

describe('Pathify', () => {
  it('Store & Reset function', () => {
    const test = new ObjectPath<TestInterface>();
    const firstPath = test.start.rootArray
      .all()
      .arrayArray.all()
      .arrayArrayProp1.$_$.pipe(
        $store((pv, val) => {
          return { aapArr: val };
        })
      )
      .$_$.backToRoot().rootString;
    const result = PathWizard.getValueFromPathify(
      firstPath.$_$.finish(),
      testInterfaceImplementation,
      undefined
    );
    expect(result).toEqual(['rootString', 'rootString']);
  });
});

describe('Pathify', () => {
  it('Validate Simple', () => {
    const test = new ObjectPath<TestInterface>();
    const simpleValidation = test.start.rootString.$_$.validIf(
      (value, pv) => value === testInterfaceImplementation.rootString
    );
    const result = PathWizard.getValueFromPathify(
      simpleValidation,
      testInterfaceImplementation,
      undefined
    );
    expect(result).toBeTruthy();
  });
});
describe('Pathify', () => {
  it('Validate & Reduce', () => {
    const test = new ObjectPath<TestInterface>();
    const path = test.start.rootArray
      .all()
      .arrayArray.all()
      .$_$.validIf((value, pv) => typeof value.arrayArrayProp1 !== 'undefined');
    const result = PathWizard.getValueFromPathify(
      path.reduce((previous, current) => previous && current, true),
      testInterfaceImplementation,
      undefined
    );
    expect(result).toBeTruthy();
  });
});
