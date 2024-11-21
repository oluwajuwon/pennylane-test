import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import InvoiceLineItem from '../../src/components/InvoiceLineItem'
import { invoiceProps } from './InvoiceCard.spec'

const props = {
  onPress: jest.fn(),
}

describe('<InvoiceLineItem /> Tests', () => {
  it('Should show the invoice line item details', () => {
    const { queryByTestId, queryByText } = render(
      <InvoiceLineItem item={invoiceProps.invoice.invoice_lines[0]} />,
    )

    expect(queryByTestId('line-item-container')).not.toBeNull()
    expect(queryByText('Tesla Model S')).toBeTruthy()
    expect(queryByText('Qty 2 X £1,980.00')).toBeTruthy()
    expect(queryByText('£2,000.00')).toBeTruthy()
  })

  it('Should call onPress when card is pressed', () => {
    const { getByTestId } = render(
      <InvoiceLineItem
        item={invoiceProps.invoice.invoice_lines[0]}
        onPress={props.onPress}
      />,
    )
    const container = getByTestId('line-item-container')

    fireEvent.press(container)
    expect(props.onPress).toHaveBeenCalledTimes(1)
  })
})
