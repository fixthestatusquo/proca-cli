import {basicAuth} from '@proca/api'
import {CliOpts} from './cli'
import {CliConfig} from './config'

export async function showToken(argv : CliOpts, _ : CliConfig) {
  const a = basicAuth({username: argv.user, password: argv.password})
  console.log(`This is your username and password in a form of Basic HTTP token:\n${JSON.stringify(a)}`)
}

export function removeBlank<A>(obj :A) : A {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
