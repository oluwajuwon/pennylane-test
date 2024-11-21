import React from 'react'
import { render } from '@testing-library/react-native'
import AddInvoiceLineItem from '../../src/components/AddInvoiceLineItem'

describe('<AddInvoiceLineItem /> Tests', () => {
  const props = {
    onAddItem: jest.fn(),
  }

  it('Should show the invoice line item', () => {
    const { queryByTestId } = render(
      <AddInvoiceLineItem addItem={props.onAddItem} />,
    )

    expect(queryByTestId('line-item-container')).not.toBeNull()
    expect(queryByTestId('product-id')).not.toBeNull()
    expect(queryByTestId('line-item-label')).not.toBeNull()
    expect(queryByTestId('line-item-quantity')).not.toBeNull()
    expect(queryByTestId('line-item-price')).not.toBeNull()
    expect(queryByTestId('line-item-total')).not.toBeNull()
  })
})
