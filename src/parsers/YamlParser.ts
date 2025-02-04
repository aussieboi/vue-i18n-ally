import { Parser } from './Parser'
import * as yaml from 'js-yaml'

export class YamlParser extends Parser {
  constructor () {
    super(['yaml'], /\.?ya?ml$/g)
  }

  async parse (text: string) {
    return yaml.safeLoad(text)
  }

  async dump (object: object) {
    return yaml.safeDump(object, {
      indent: this.options.indent,
    })
  }

  navigateToKey (text: string, keypath: string) {
    const keys = keypath.split('.')

    let regexString = keys
      .map((key, i) => `^[ \\t]{${i * this.options.indent}}${key}: ?`)
      .join('[\\s\\S]*')
    regexString += ' (.*)$'
    const regex = new RegExp(regexString, 'gm')

    const match = regex.exec(text)
    if (match && match.length >= 2) {
      const end = match.index + match[0].length
      const value = match[1]
      const start = end - value.length
      return { start, end }
    }
    else {
      return undefined
    }
  }
}
