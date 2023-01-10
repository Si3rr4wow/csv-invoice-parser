export interface InvoiceData {
  vendor: string
  invoiceDate: string
  dueDate: string
  vatNumber: string
}

const isKvpRow = (row: string[]): boolean => {
  return (
    !!row[0] &&
    !!row[1] &&
    row.every((cell, i) => {
      if (i <= 1) return true
      return !cell
    })
  )
}

const isFullRow = (row: string[]): boolean => {
  return row.every((cell) => {
    return cell
  })
}

const isTotalRow = (row: string[]): boolean => {
  return row[0] === 'Total'
}

const objectifyLineItemRow = (
  tableHeader: string[],
  row: string[],
): Record<string, string> => {
  return tableHeader.reduce(
    (acc, heading, j) => ({
      ...acc,
      [heading]: row[j],
    }),
    {},
  )
}

const applyStructure = (
  cells: string[][],
): { kvps: Record<string, string>; lineItems: Record<string, string>[] } => {
  let tableHeader: string[] | null = null
  return cells.reduce(
    (acc, row) => {
      if (isKvpRow(row)) {
        return {
          ...acc,
          kvps: { ...acc.kvps, [row[0]]: row[1] },
        }
      }
      if (isFullRow(row) && !tableHeader) {
        tableHeader = row
        return acc
      }
      if (isTotalRow(row)) {
        return acc
      }
      if (isFullRow(row)) {
        if (!tableHeader) {
          throw new Error('Encountered a line item before finding a header.')
        }
        const lineItem = objectifyLineItemRow(tableHeader, row)
        return {
          ...acc,
          lineItems: [...acc.lineItems, lineItem],
        }
      }
      return acc
    },
    {
      kvps: {},
      lineItems: [] as Record<string, string>[],
    },
  )
}

export const parseCsv = (csv: string): void => {
  const newLineDelimiter = csv.search('\r\n') ? '\r\n' : '\n'
  const rows = csv.split(newLineDelimiter)
  const cells = rows.map((row) => row.split(',').slice(0, -1))
  const { kvps, lineItems } = applyStructure(cells)
  console.log(
    '🚀 ~ file: parse-csv.ts:70 ~ parseCsv ~ { ...kvps, lineItems }',
    { ...kvps, lineItems },
  )
}
