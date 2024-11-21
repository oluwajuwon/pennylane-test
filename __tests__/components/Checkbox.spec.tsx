import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Checkbox from '../../src/components/Checkbox'

describe('<Checkbox /> Tests', () => {
  const props = {
    onCheck: jest.fn(),
  }

  it('Should show the checkbox', () => {
    const { queryByTestId } = render(<Checkbox onCheck={props.onCheck} />)

    expect(queryByTestId('checkbox-container')).not.toBeNull()
  })

  it('Should show the checkbox mark when it is checked', () => {
    const { queryByText, getByTestId } = render(
      <Checkbox onCheck={props.onCheck} />,
    )
    const container = getByTestId('checkbox-container')

    expect(queryByText('x')).toBeNull()

    fireEvent.press(container)
    expect(queryByText('x')).toBeTruthy()

    fireEvent.press(container)
    expect(queryByText('x')).toBeNull()
  })
})
