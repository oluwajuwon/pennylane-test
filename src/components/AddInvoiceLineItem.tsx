import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'

type AddItemPayload = {
  label: string
  quantity: number
  price: number | string
  product_id: number
}

type Props = {
  addItem: (payload: AddItemPayload) => void
  isDisabled?: boolean
}

const initialState = {
  label: '',
  quantity: '',
  price: '',
  product_id: '',
}

const AddInvoiceLineItem = ({ addItem }: Props) => {
  const [state, setState] = useState(initialState)
  const [error, setError] = useState('')

  const onSubmit = () => {
    if (Object.values(state).includes('')) {
      return setError('Add all values')
    }

    const payload = {
      ...state,
      price: Number(state.price).toFixed(2),
      quantity: Number(state.quantity),
      product_id: Number(state.product_id),
    }

    addItem(payload)
    setState(initialState)
  }

  const total = Number(state.quantity) * Number(state.price)

  return (
    <View style={styles.container} testID="line-item-container">
      <View style={styles.row}>
        {/* This should be a search for products like the customer search */}
        <TextInput
          onChangeText={(text) => setState({ ...state, product_id: text })}
          placeholder="Product ID (eg. 62)"
          style={[styles.textInput, { width: 150 }]}
          placeholderTextColor={'#999'}
          keyboardType="number-pad"
          value={state.product_id}
          testID="product-id"
        />
        {/* This should be prefilled from the product id search search */}
        <TextInput
          onChangeText={(text) => setState({ ...state, label: text })}
          placeholder="Label"
          style={[styles.textInput, styles.rowInput, { flexGrow: 2 }]}
          placeholderTextColor={'#999'}
          value={state.label}
          testID="line-item-label"
        />
      </View>
      <View style={styles.row}>
        <TextInput
          onChangeText={(text) => setState({ ...state, quantity: text })}
          placeholder="Quantity (eg. 2)"
          style={[styles.textInput, styles.rowInput]}
          placeholderTextColor={'#999'}
          keyboardType="number-pad"
          value={state.quantity}
          testID="line-item-quantity"
        />
        {/* This should be prefilled from the product id search search */}
        <TextInput
          onChangeText={(text) => setState({ ...state, price: text })}
          placeholder="Price (eg. 100)"
          style={[styles.textInput, styles.rowInput]}
          placeholderTextColor={'#999'}
          keyboardType="number-pad"
          value={state.price}
          testID="line-item-price"
        />
        <TextInput
          value={total.toString()}
          placeholder="Total"
          style={[
            styles.textInput,
            styles.rowInput,
            { backgroundColor: '#DEDEDE' },
          ]}
          placeholderTextColor={'#999'}
          editable={false}
          testID="line-item-total"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.btnTxt}>Add Item</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddInvoiceLineItem

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CECECE',
  },
  textInput: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    height: 40,
  },
  rowInput: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
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
