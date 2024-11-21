import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Components } from '../api/generated/client'
import { formatNumber, getPaidOrUnpaidTxt } from '../utils'

type Props = {
  invoice: Components.Schemas.Invoice
  onPressCard: (id: number) => void
}

const InvoiceCard = ({ invoice, onPressCard }: Props) => {
  const invoiceDate = invoice.date ? new Date(invoice.date).toDateString() : ''

  function onPress() {
    onPressCard(invoice.id)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID="invoice-card-container"
    >
      <View style={styles.left}>
        <Text style={styles.id}>#{invoice.id}</Text>
        <Text>{invoiceDate}</Text>
      </View>
      <View style={styles.right}>
        <Text>£{formatNumber(Number(invoice.total))}</Text>
        <View
          style={[
            styles.status,
            invoice.paid ? styles.paidBox : styles.unpaidBox,
          ]}
        >
          <Text>{getPaidOrUnpaidTxt(invoice)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default InvoiceCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  left: {
    gap: 3,
  },
  id: {
    fontSize: 16,
    fontWeight: '700',
  },
  right: {
    alignItems: 'flex-end',
    gap: 3,
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  paidBox: {
    backgroundColor: '#cffde7',
  },
  unpaidBox: {
    backgroundColor: '#fceed5',
  },
  overdueBox: {
    backgroundColor: '#fce3e2',
  },
})
