# Conffi: A Modern Configuration Library
Conffi is a TypeScript library designed to simplify and streamline the process of creating configuration objects for your applications. It offers a flexible and type-safe approach for managing both global configurations and smaller, application-specific configurations.

### Core Principles
Conffi prioritizes type enforcement throughout its design. This ensures type safety not only through a typed code but also through the runtime API itself. Additionally, the library provides convenient tools for manipulating values during configuration loading.

## Getting Started

```
npm install conffi
```

Conffi's functional style allows for flexible usage. However, to get you started, here's a basic example:
1. `createConfig`: This function is the heart of Conffi. It generates a function that ultimately resolves your configuration object. Importantly, `createConfig` is asynchronous to accommodate both runtime and load-time configuration creation.

```typescript
import {createConfig} from 'conffi'

type Config = {
  host: string
}

const createMainConfig = createConfig<Config>(({env}) => ({
  host: env('host')
}))

const config = await createMainConfig() // {host}
```
Here, we define a configuration type (Config) and provide a callback function to createConfig. This callback receives an object containing helper functions for building the configuration. In this example, we utilize the env function to retrieve a value from the environment variables.

2. *Alternative Approach*: While the callback provides access to helper functions, you can alternatively define the configuration directly:
```typescript
import {createConfig, env} from 'conffi'

type Config = {
  host: string,
  port: number
}

const createMainConfig = createConfig<Config>({
  host: env('host'),
  port: env('port').number()
})

const config = await createMainConfig() // {host, port}
```

### Runtime Support
Conffi extends its functionality to runtime environments, allowing you to pass parameters during configuration creation. These parameters can serve as fallbacks if environment variables are unavailable.

```typescript
type Config = {host: string}

// let's assume that there is no environment variable of host
delete process.env['host']

const createMainConfig = createConfig<Config>(({env}) => ({
  host: env('host')
}))

// This function will throw an error, since host doesn't exist
const config = await createMainConfig()

// This however will used as fallback:
const config = await createMainConfig({host: 'google.com'}) // {host: 'google.com}
```

Preferably, configuration values can be entirely derived from runtime logic:
```typescript
const createMainConfig = createConfig(({runtime}) => ({
  host: runtime()
}))

const config = await createConfig({host: 'google.com'}) // {host: 'google.com'}
```
The idea behind it is to let us mix between environment variable and runtime properties that could (if configured) override them.

### Getters
Conffi provides various getter functions that introduce new values and manipulation capabilities to the configuration provider. Here are a few examples:

* `env(variableName: string)`: Retrieves a value from environment variables.
* `runtime()`: Retrieves a value from the runtime environment (useful for dynamic configuration).
* `or(...getters: Getter<any>[])`: Combines multiple getters, using the first non-null value as the fallback.
* `get(callback: <T>() => T | Promise<T>)`: Allows incorporating any function that returns a promise or a direct value.

```typescript
import {createConfig} from 'conffi'

const createMainConfig = createConfig(({env, runtime, or, get}) => ({
  fromEnvironment: env('{env name}'),
  fromRuntimeValue: runtime(), // based on the given key
  conjunction: or(env('var'), env('another var')) // accepts different getters to fallback to
  anyValue: get(() => getValue().then((val) => val)) // accepts any callback that returns a promise or a value
}))
```

### Manipulators
Conffi offers manipulators to transform retrieved values. These manipulators provide a chainable API for easy manipulation:

* `string()`: Converts the value to a string.
* `number()`: Converts the value to an integer.
* `boolean()`: Converts the value to a boolean.
* `test(customTest: (value: any) => boolean | Promise<boolean>)`: Performs a custom test on the value, throwing an error with a provided message if the test fails. Supports asynchronous tests.
* `parse(customParser: <T>(value: any) => T | Promise<T>)`: Allows custom parsing logic for transforming the value.

By leveraging getters and manipulators, you can ensure your configuration values are in the desired format and meet any necessary validation requirements.

```typescript
import {createConfig} from 'conffi'

const createMainConfig = createConfig(({env, runtime, or, get}) => ({
  text: env('textual').string(),
  number: env('numeric').number(), // translates to an integer
  bool: env('boolean').boolean(),
  customTest: env('custom').number().test((value) => value > 5, 'Value should be bigger'), // Custom tests, supports promises
  customValue: env('custom').parse((value) => Number.parseInt(value, 10)) // Translating to int ourselves
}))
```
