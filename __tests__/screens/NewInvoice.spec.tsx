import { useNavigation } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react-native'
import React from 'react'
import { useApi } from '../../src/api'
import NewInvoice from '../../src/screens/NewInvoice'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../src/api', () => ({
  useApi: jest.fn(),
}))

jest.mock('react-native-config', () => ({
  API_TOKEN: '12345',
}))

const mockNavigation = { goBack: jest.fn() }
const mockApi = {
  getSearchCustomers: jest.fn(),
  postInvoices: jest.fn(),
}
const queryClient = new QueryClient()

describe('<NewInvoice /> Tests', () => {
  beforeEach(() => {
    const api = useApi as jest.Mock
    const navigation = useNavigation as jest.Mock

    navigation.mockReturnValue(mockNavigation)
    api.mockReturnValue(mockApi)

    jest.clearAllMocks()
  })

  it('Should render the new invoice screen correctly', () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(
      <QueryClientProvider client={queryClient}>
        <NewInvoice />
      </QueryClientProvider>,
    )

    expect(getAllByText('Create Invoice')).toHaveLength(2)
    expect(getByText('Recipient')).toBeTruthy()
    expect(getByPlaceholderText('Search for a recipient')).toBeTruthy()
    expect(getByText('Item(s)')).toBeTruthy()
    expect(getByPlaceholderText('Deadline (eg. 2024-12-02)')).toBeTruthy()
  })
})
