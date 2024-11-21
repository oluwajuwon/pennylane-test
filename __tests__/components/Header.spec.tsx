import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Header from '../../src/components/Header'

describe('<Header /> Tests', () => {
  const props = {
    onGoBack: jest.fn(),
    title: 'Header Component',
  }

  it('Should show the Header and title', () => {
    const { queryByTestId, queryByText } = render(
      <Header onGoBack={props.onGoBack} title={props.title} />,
    )

    expect(queryByTestId('header-container')).not.toBeNull()
    expect(queryByText('Header Component')).toBeTruthy()
  })

  it('Should call onGoBack when back button is pressed', () => {
    const { getByTestId } = render(
      <Header onGoBack={props.onGoBack} title={props.title} />,
    )

    const backButton = getByTestId('header-back-button')

    fireEvent.press(backButton)

    expect(props.onGoBack).toHaveBeenCalledTimes(1)
  })
})
