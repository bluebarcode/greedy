import { PathType } from '../typings/path-type';
import { pathify } from './path-wizard-pathify';
import { TokenType } from './token-type.enum';

export class ObjectPath<BaseType, PathVariablesType = any> {
  start = pathify(<BaseType>{}, <PathVariablesType>{});
  variable = <K extends keyof PathVariablesType>(
    variable: K
  ): PathType<PathVariablesType[K]> =>
    <PathType<PathVariablesType[K]>>{
      get() {
        return [{ type: TokenType.property_dynamic, property: variable }];
      }
    };
}

// const pathify2 = <a, b>() => pathify(<a>{}, <b>{});

// const test = pathify2<StbsProject, any>();
// /**
//  * Extracts function arguments
//  */
// export type ExtractFunctionArguments<Fn> = Fn extends (...args: infer P) => any
//   ? P
//   : never;

// /**
//  * Extracts function return values
//  */
// export type ExtractFunctionReturnValue<Fn> = Fn extends (
//   ...args: any[]
// ) => infer P
//   ? P
//   : never;

// type BooleanSwitch<Test, T = true, F = false> = Test extends true ? T : F;

// /**
//  * Replacement for Function, represents any kind of function.
//  */
// export type AnyFunction = (...args: any[]) => any;

// /**
//  * Represents any function with an arity of 1.
//  */
// export type AnyFunction1 = (a: any) => any;

// // This is used as an arbitrary literal that should not match anything else.
// type Arbitrary = 'It is now 1554792354 seconds since since Jan 01, 1970';

// // An type to test if a type is `any` within a specific context
// type IsAny<O, T = true, F = false> = Arbitrary extends O
//   ? any extends O
//     ? T
//     : F
//   : F;

// /**
//  * A powerful recursive type function composition using `pipe`.
//  */
// export type Pipe<
//   Fns extends any[],
//   IsPipe = true,
//   PreviousFunction = void,
//   InitalParams extends any[] = any[],
//   ReturnType = any
// > = {
//   next: ((..._: Fns) => any) extends ((
//     _: infer First,
//     ..._1: infer Next
//   ) => any)
//     ? PreviousFunction extends void
//       ? Pipe<
//           Next,
//           IsPipe,
//           First,
//           ExtractFunctionArguments<First>,
//           ExtractFunctionReturnValue<First>
//         >
//       : ReturnType extends ExtractFunctionArguments<First>[0]
//       ? Pipe<
//           Next,
//           IsPipe,
//           First,
//           InitalParams,
//           ExtractFunctionReturnValue<First>
//         >
//       : IsAny<ReturnType> extends true
//       ? Pipe<
//           Next,
//           IsPipe,
//           First,
//           InitalParams,
//           ExtractFunctionReturnValue<First>
//         >
//       : {
//           ERROR: [
//             'Return type ',
//             ReturnType,
//             'does comply with the input of',
//             ExtractFunctionArguments<First>[0]
//           ];
//           POSITION: [
//             'Position of problem for input arguments is at',
//             Fns['length'],
//             'from the',
//             BooleanSwitch<IsPipe, 'end', 'beginning'>,
//             'and the output of function to the ',
//             BooleanSwitch<IsPipe, 'left', 'right'>
//           ];
//         }
//     : never;
//   done: (...args: InitalParams) => ReturnType;
// }[Fns extends [] ? 'done' : 'next'];

// export type Pipe2<
//   Fns extends any[],
//   PathVariables = void,
//   OriginType = void,
//   In = void,
//   InitialFlat = void,
//   InitialStoreIn = void
// > = {
//   1: ((..._: Fns) => any) extends ((
//     _: OpFunc<
//       In,
//       infer FirstOut,
//       InitialFlat,
//       infer FirstFlatOut,
//       PathVariables,
//       InitialStoreIn,
//       infer FirstStoreOut,
//       OriginType
//     >,
//     ..._1: infer Next
//   ) => any)
//     ? Pipe2<
//         Next,
//         PathVariables,
//         OriginType,
//         FirstOut,
//         FirstFlatOut,
//         FirstStoreOut
//       >
//     : never;
//   0: TraversablePathType<
//     In,
//     InitialFlat,
//     OriginType,
//     PathVariables,
//     InitialStoreIn
//   >;
// }[Fns extends [] ? 0 : 1];

// type testFunc = (num: number, str: string) => object;
// type testFunc2 = (obj: object) => string;
// type piped = Pipe<[testFunc, testFunc2]>;
// type pipes2 = Pipe2<[testFunc, testFunc2]>;
// /**
//  * An example of `Pipe` used in a `pipe` function
//  */

// export type PipeFn<
//   PathVariables,
//   OriginType,
//   In,
//   Flat,
//   Store,
//   FlatOut = any,
//   StoreOut = any
// > = <
//   Fns extends [
//     OpFunc<In, Flat, FlatOut, Store, StoreOut, OriginType>,
//     ...AnyFunction1[]
//   ]
// >(
//   ...fns: Fns &
//     Pipe2<Fns, PathVariables, OriginType, In, Flat, Store> extends AnyFunction
//     ? Fns
//     : never
// ) => Pipe2<Fns, PathVariables, OriginType, In, Flat, Store>;

// type params = [1, 2, 3, 'abc', number, object];

// type LastType<Types extends any[], LatestType = any> = {
//   1: ((...t: Types) => any) extends ((f: infer First, ...l: infer Next) => any)
//     ? LastType<Next, First>
//     : never;
//   0: LatestType;
// }[Types extends [] ? 0 : 1];

// type hans = LastType<params>;

// export interface TestPipeable<
//   Flat,
//   OriginType,
//   T,
//   PathVariablesType,
//   Store
// > {
//   pipe2: PipeFn<PathVariablesType, OriginType, T, Flat, Store>;
// }

// const testPipable:TestPipeable<true,{a:number},{a:number},void,{}>=<TestPipeable<true,{a:number},{a:number},void,{}>>{};
// // @ts-ignore
// const result =testPipable.pipe2($filter((val,vars)=>true));
