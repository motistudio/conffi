import {createConfig, env, or, runtime, get} from '../../../src/index'

import setEnv from '../../utils/setEnv'

describe('Library', () => {
  const environment = {text: 'some text', numericText: '123', number: 0, anotherNumber: 1, bool: true}
  const reset = setEnv(environment)

  afterAll(reset)

  test('Should do a dry-run', async () => {
    const runtimeValues = {numericText: '456', bool: false, age: 21, name: 'moti', dynamic: 'dynamic'}

    const create = createConfig({
      text: or(env('text').string()),
      numericText: or(runtime().string(), env('runtimeText').string()),
      number: env('number').number(),
      anotherNumber: env('anotherNumber').number(),
      bool: or(env('bool').boolean(), runtime().boolean()),
      optional: env('optional').optional(),
      age: runtime().number().test((num) => num > 18),
      doubleNum: env('anotherNumber').number().parse((n: number) => {
        return n * 2
      }),
      dynamic: get(() => Promise.resolve('dynamic'))
    })

    await expect(create(runtimeValues)).resolves.toMatchObject({
      ...environment,
      numericText: runtimeValues.numericText,
      age: runtimeValues.age,
      doubleNum: environment.anotherNumber * 2,
      dynamic: runtimeValues.dynamic
    })
  })

  test('Should do a dry-run using a callback', async () => {
    const runtimeValues = {numericText: '456', bool: false, age: 21, name: 'moti', dynamic: 'dynamic'}

    const create = createConfig(({or, env, runtime}) => ({
      text: or(env('text').string()),
      numericText: or(runtime().string(), env('runtimeText').string()),
      number: env('number').number(),
      anotherNumber: env('anotherNumber').number(),
      bool: or(env('bool').boolean(), runtime().boolean()),
      optional: env('optional').optional(),
      age: runtime().number().test((num) => num > 18),
      doubleNum: env('anotherNumber').number().parse((n: number) => {
        return n * 2
      }),
      dynamic: get(() => Promise.resolve('dynamic'))
    }))

    await expect(create(runtimeValues)).resolves.toMatchObject({
      ...environment,
      numericText: runtimeValues.numericText,
      age: runtimeValues.age,
      doubleNum: environment.anotherNumber * 2,
      dynamic: runtimeValues.dynamic
    })
  })
})

