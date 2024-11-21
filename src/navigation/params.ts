import { Routes } from './routes'

export type ParamList = {
  [Routes.Home]: undefined
  [Routes.Invoice]: { invoiceId: number }
  [Routes.NewInvoice]: undefined
}
