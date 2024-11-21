import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Config from 'react-native-config'
import { useDebounce } from 'tamagui'
import { useApi } from '../api'
import { Components } from '../api/generated/client'
import AddInvoiceLineItem from '../components/AddInvoiceLineItem'
import Checkbox from '../components/Checkbox'
import Header from '../components/Header'
import InvoiceLineItem from '../components/InvoiceLineItem'
import RecipientCard from '../components/RecipientCard'
import { ParamList } from '../navigation/params'
import { getCurrentDate } from '../utils'

type CreateInvoice = Components.Schemas.InvoiceCreatePayload
type Customer = Components.Schemas.Customer
type InvoiceLineItem = Components.Schemas.InvoiceLineCreatePayload

const NewInvoice = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>()
  const apiClient = useApi()
  const debounce = useDebounce(searchCustomers, 500)

  const queryClient = new QueryClient()

  const [state, setState] = useState<Partial<CreateInvoice>>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>()

  async function searchCustomers() {
    try {
      const { data } = await apiClient.getSearchCustomers({
        query: searchQuery,
      })
      setCustomers(data.customers)
    } catch (error) {
      throw error
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const onChangeSearchText = (text: string) => {
    setSearchQuery(text)
    debounce()
  }

  const onSelectCustomer = (item: Customer) => {
    setSelectedCustomer(item)
    setState({ ...state, customer_id: item.id })
    setCustomers([])
  }

  const onAddItem = (item: InvoiceLineItem) => {
    setState({
      ...state,
      invoice_lines_attributes: state.invoice_lines_attributes
        ? [...state.invoice_lines_attributes, item]
        : [item],
    })
  }

  const onSubmit = async () => {
    try {
      await apiClient.postInvoices(
        { 'X-SESSION': String(Config.API_TOKEN) },
        { invoice: { ...state, date: getCurrentDate() } as CreateInvoice },
      )
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      navigation.goBack()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Create Invoice" onGoBack={goBack} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView>
          <Text style={styles.header}>Recipient</Text>
          {selectedCustomer ? (
            <View>
              <RecipientCard
                customer={selectedCustomer}
                onPress={() => setSelectedCustomer(undefined)}
                showCloseIcon={true}
              />
            </View>
          ) : (
            <View style={styles.recipientContainetr}>
              <TextInput
                onChangeText={onChangeSearchText}
                style={styles.textInput}
                placeholder="Search for a recipient"
                placeholderTextColor={'#999'}
              />
              {customers.length > 0 && (
                <View style={styles.floatingList}>
                  <FlatList
                    data={customers}
                    renderItem={({ item }) => (
                      <RecipientCard
                        customer={item}
                        onPress={() => onSelectCustomer(item)}
                        showCloseIcon={false}
                      />
                    )}
                    contentContainerStyle={styles.list}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.mainListStyle}
                  />
                </View>
              )}
            </View>
          )}
          <View style={styles.itemsContainer}>
            <Text style={styles.header}>Item(s)</Text>
            <View>
              <AddInvoiceLineItem addItem={onAddItem} />
              {state.invoice_lines_attributes?.map((il) => (
                <View style={styles.linItemcontainer} key={il.product_id}>
                  <View>
                    <Text style={styles.label}>{il.label}</Text>
                    <Text style={styles.quantity}>
                      Qty {il.quantity} X £{il.price}
                    </Text>
                  </View>
                  {il.quantity && il.price && (
                    <Text style={styles.price}>
                      £{il.quantity * Number(il.price)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
          {/* This should be a date Picker */}
          <TextInput
            onChangeText={(text) => setState({ ...state, deadline: text })}
            style={styles.textInput}
            placeholder="Deadline (eg. 2024-12-02)"
            placeholderTextColor={'#999'}
            keyboardType="numbers-and-punctuation"
          />
          <View style={styles.row}>
            <Text style={styles.label}>Paid</Text>
            <Checkbox onCheck={(val) => setState({ ...state, paid: val })} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Finalized</Text>
            <Checkbox
              onCheck={(val) => setState({ ...state, finalized: val })}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.btnTxt}>Create Invoice</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default NewInvoice

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  selectTxt: {
    textDecorationLine: 'underline',
  },
  textInput: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  floatingList: {
    position: 'absolute',
    backgroundColor: '#FFF',
    right: 0,
    left: 0,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    top: 50,
  },
  recipientContainetr: {
    zIndex: 10000,
  },
  mainListStyle: {
    marginTop: 10,
  },
  list: {
    gap: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemsContainer: {
    marginTop: 20,
    zIndex: 1,
  },

  addItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    color: '#5e5d5d',
  },
  price: {
    fontWeight: '600',
  },
  linItemcontainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CECECE',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#325aa8',
    borderRadius: 8,
  },
  btnTxt: {
    color: '#FFF',
  },
})
