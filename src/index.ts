import { loadCsv } from './load-csv'
import { parseCsv } from './parse-csv'
;(async (): Promise<void> => {
  const csv = await loadCsv()
  parseCsv(csv)
})()
