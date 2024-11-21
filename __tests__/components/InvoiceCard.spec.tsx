import React from 'react'
import { render } from '@testing-library/react-native'
import InvoiceCard from '../../src/components/InvoiceCard'
import { Components } from '../../src/api/generated/client'

export const invoiceProps = {
  invoice: {
    id: 1934,
    customer_id: 152,
    finalized: false,
    paid: false,
    date: '2024-11-12',
    deadline: '2024-11-12',
    total: '300.00',
    tax: '20.00',
    invoice_lines: [
      {
        id: 9181,
        invoice_id: 1934,
        product_id: 152,
        quantity: 2,
        label: 'Tesla model S',
        unit: 'piece' as Components.Schemas.Unit,
        vat_rate: '5.5' as Components.Schemas.VatRate,
        price: '2000.0',
        tax: '110',
        product: {
          id: 152,
          label: 'Tesla Model S',
          vat_rate: '5.5' as Components.Schemas.VatRate,
          unit: 'piece' as Components.Schemas.Unit,
          unit_price: '1980',
          unit_price_without_tax: '1800',
          unit_tax: '180',
        },
      },
    ],
  },
  onPressCard: jest.fn(),
}

describe('<InvoiceCard /> Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should show the invoice card and details', () => {
    const { queryByTestId, queryByText } = render(
      <InvoiceCard
        invoice={invoiceProps.invoice}
        onPressCard={invoiceProps.onPressCard}
      />,
    )

    expect(queryByTestId('invoice-card-container')).not.toBeNull()
    expect(queryByText('#1934')).toBeTruthy()
    expect(queryByText('£300.00')).toBeTruthy()
    expect(queryByText('Overdue')).toBeTruthy()
  })
})
