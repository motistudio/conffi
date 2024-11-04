import createConfig from "./lib/createConfig";
import {env, or, runtime, get} from './lib/getters'
import type {
  Initializer,
  ObjectLiteral,
  GetterValue,
  Getter,
  GetterType,
  ApiGetter,
  Manipulator,
  RuntimeManipulator,
  Definition,
  BaseDefinition
} from './lib/types.t'

export {
  createConfig,
  env,
  or,
  runtime,
  get
}

export type {
  Initializer,
  ObjectLiteral,
  GetterValue,
  Getter,
  GetterType,
  ApiGetter,
  Manipulator,
  RuntimeManipulator,
  Definition,
  BaseDefinition
}
