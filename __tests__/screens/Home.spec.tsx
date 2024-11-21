import { useNavigation } from '@react-navigation/native'
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { useApi } from '../../src/api'
import Home from '../../src/screens/Home'

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useInfiniteQuery: jest.fn(),
}))

jest.mock('../../src/api', () => ({
  useApi: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

const mockNavigation = {
  navigate: jest.fn(),
}

const queryClient = new QueryClient()

describe('<Home /> Tests', () => {
  beforeEach(() => {
    const api = useApi as jest.Mock
    const navigation = useNavigation as jest.Mock
    const infiniteQuery = useInfiniteQuery as jest.Mock

    api.mockReturnValue({
      getInvoices: jest.fn(),
    })
    navigation.mockReturnValue(mockNavigation)

    infiniteQuery.mockImplementation(() => ({
      data: {
        pages: [
          {
            invoices: [{ id: 1, total: 300, paid: true }],
            pagination: { page: 1 },
          },
        ],
      },
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetching: false,
    }))

    jest.clearAllMocks()
  })

  it('Should render home screen correctly', () => {
    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    )

    expect(getByText('Hi Jane,')).toBeTruthy()
    expect(getByText('Take a look at your invoices')).toBeTruthy()
    expect(getByTestId('create-invoice-button')).toBeTruthy()
    expect(getByTestId('invoice-list')).toBeTruthy()
  })

  it('Should fetch and displays invoices', async () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    )

    await waitFor(() => expect(getByText('£300.00')).toBeTruthy())
    await waitFor(() => expect(getByText('#1')).toBeTruthy())
    await waitFor(() => expect(getByText('Paid')).toBeTruthy())
  })

  it('Should navigate to invoice details when invoice card is pressed', async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    )

    const invoiceCard = await waitFor(() =>
      getByTestId('invoice-card-container'),
    )
    fireEvent.press(invoiceCard)
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Invoice', {
      invoiceId: 1,
    })
  })
})
