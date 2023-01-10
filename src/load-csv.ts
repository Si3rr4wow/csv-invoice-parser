import { readFile } from 'fs'
import { join } from 'path'

export const loadCsv = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    readFile(join(__dirname, './test-invoice.csv'), (err, data) => {
      if (err) return reject(err)
      resolve(data.toString())
    })
  })
}
