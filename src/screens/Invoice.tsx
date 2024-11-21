import { useNavigation } from '@react-navigation/native'
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useApi } from '../api'
import { Components } from '../api/generated/client'
import Header from '../components/Header'
import InvoiceLineItem from '../components/InvoiceLineItem'
import { ParamList } from '../navigation/params'
import { Routes } from '../navigation/routes'
import { formatNumber, getPaidOrUnpaidTxt } from '../utils'

type Props = NativeStackScreenProps<ParamList, Routes.Invoice>
interface FetchInvoiceWithCustomerResponse extends Components.Schemas.Invoice {
  customer: Components.Schemas.Customer
  invoice_lines: Components.Schemas.InvoiceLine[]
}

const Invoice = ({ route }: Props) => {
  const apiClient = useApi()
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>()
  const { invoiceId } = route.params
  const queryClient = useQueryClient()

  const { data: invoice } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: fetchInvoice,
  })

  async function fetchInvoice(): Promise<FetchInvoiceWithCustomerResponse> {
    try {
      const { data } = await apiClient.getInvoice({
        id: invoiceId,
      })
      return data as FetchInvoiceWithCustomerResponse
    } catch (error) {
      throw error
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const onDeleteInvoice = async () => {
    try {
      const { data } = await apiClient.deleteInvoice({
        id: invoiceId,
      })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      navigation.goBack()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const onFinalizeInvoice = async () => {
    try {
      const { data } = await apiClient.putInvoice(
        {
          id: invoiceId,
        },
        { invoice: { finalized: true, id: invoiceId } },
      )
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      return data
    } catch (error) {
      console.error(error)
    }
  }

  if (!invoice) {
    return <></>
  }

  const invoiceDate = invoice.date ? new Date(invoice.date).toDateString() : ''
  const invoiceDeadline = invoice.deadline
    ? new Date(invoice.deadline).toDateString()
    : ''

  return (
    <View style={styles.container}>
      <Header title="Invoice" onGoBack={goBack} />
      <ScrollView>
        <View>
          <View style={styles.customerStatus}>
            <Text style={styles.headerTxt}>Invoice #{invoice?.id}</Text>

            <View
              style={[
                styles.status,
                invoice?.paid ? styles.paidBox : styles.unpaidBox,
              ]}
            >
              <Text>{getPaidOrUnpaidTxt(invoice)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.amountInfo}>
          <Text style={styles.fieldTop}>Issued To</Text>
          <Text style={styles.customerName}>
            {invoice?.customer.first_name} {invoice?.customer.last_name}
          </Text>
          <View>
            <Text style={styles.fieldTop}>Amount Due</Text>
            <Text style={styles.total}>
              £{formatNumber(Number(invoice.total))}
            </Text>
          </View>
          <View style={styles.dateInfoContainer}>
            <View>
              <Text style={styles.fieldTop}>Issued On</Text>
              <Text style={styles.dateInfo}>{invoiceDate}</Text>
            </View>
            <View>
              <Text style={styles.fieldTop}>Deadline</Text>
              <Text style={styles.dateInfo}>{invoiceDeadline}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.itemsHeader}>Items</Text>
        <View style={styles.itemsInfo}>
          {invoice.invoice_lines.map((item) => (
            <InvoiceLineItem item={item} key={item.id} />
          ))}
          <View style={styles.row}>
            <Text>Sub-total</Text>
            <Text>{invoice.total}</Text>
          </View>
          <View style={styles.row}>
            <Text>Tax</Text>
            <Text>{invoice.tax}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.finalizeBtn]}
          disabled={invoice.finalized}
          onPress={onFinalizeInvoice}
        >
          <Text>
            {invoice.finalized ? 'Invoice Finalized' : 'Finalize Invoice'}
          </Text>
        </TouchableOpacity>
        {/* This should normally open a modal to ask if you're sure */}
        <TouchableOpacity
          style={[styles.button, styles.deleteBtn]}
          onPress={onDeleteInvoice}
        >
          <Text>Delete Invoice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Invoice

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    backgroundColor: '#eff0ef',
    flex: 1,
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: '700',
  },
  customerName: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '500',
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
    backgroundColor: '#f7d074',
  },
  overdueBox: {
    backgroundColor: '#e38368',
  },
  customerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountInfo: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 12,
    marginTop: 10,
    borderColor: '#dbdbdb',
    borderWidth: 1,
  },
  fieldTop: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
  },
  dateInfo: {
    fontSize: 16,
  },
  dateInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CECECE',
  },
  itemsHeader: {
    marginTop: 20,
    fontSize: 16,
  },
  itemsInfo: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 12,
    marginTop: 10,
    borderColor: '#dbdbdb',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  finalizeBtn: {
    backgroundColor: '#CECECE',
    marginTop: 20,
  },
  deleteBtn: {
    backgroundColor: '#d64757',
  },
})
