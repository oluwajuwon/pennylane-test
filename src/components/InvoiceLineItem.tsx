import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Components } from '../api/generated/client'
import { formatNumber } from '../utils'

type Props = {
  item: Components.Schemas.InvoiceLine
  onPress?: () => void
  isDisabled?: boolean
}

const InvoiceLineItem = ({ item, isDisabled, onPress }: Props) => {
  const unitPrice = formatNumber(Number(item.product.unit_price))

  const itemPrice = formatNumber(Number(item.price))

  return (
    <TouchableOpacity
      style={styles.container}
      disabled={isDisabled}
      onPress={onPress}
      testID="line-item-container"
    >
      <View>
        <Text style={styles.label}>{item.product.label}</Text>
        <Text style={styles.quantity}>
          Qty {item.quantity} X £{unitPrice}
        </Text>
      </View>
      <Text style={styles.price}>£{itemPrice}</Text>
    </TouchableOpacity>
  )
}

export default InvoiceLineItem

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CECECE',
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
})
