import { Components } from '../api/generated/client'

export function isDatePassed(date: string) {
  let inputDate = new Date(date)

  let currentDate = new Date()

  return inputDate < currentDate
}

export function getPaidOrUnpaidTxt(invoice: Components.Schemas.Invoice) {
  if (!invoice.date) {
    return invoice.paid ? 'Paid' : 'Unpaid'
  }
  if (!invoice.paid && isDatePassed(invoice.date)) {
    return 'Overdue'
  } else if (invoice.paid) {
    return 'Paid'
  } else {
    return 'Unpaid'
  }
}

export function formatNumber(number: number) {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)

  return formattedNumber
}

export function getCurrentDate() {
  const currentDate = new Date()

  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
