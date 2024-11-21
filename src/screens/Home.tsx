import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useMemo } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useApi } from '../api'
import { SafeAreaView } from 'react-native-safe-area-context'
import InvoiceCard from '../components/InvoiceCard'
import { Paths } from '../api/generated/client'
import { useNavigation } from '@react-navigation/native'
import { Routes } from '../navigation/routes'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamList } from '../navigation/params'

type FetchInvoicesResponse = Paths.GetInvoices.Responses.$200
type Params = { pageParam?: number }

const Home = () => {
  const apiClient = useApi()
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>()

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.pagination.page,
  })

  async function fetchInvoices({
    pageParam,
  }: Params): Promise<FetchInvoicesResponse> {
    try {
      const { data } = await apiClient.getInvoices({
        page: pageParam,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  function getMoreInvoices() {
    if (!hasNextPage) {
      fetchNextPage()
    }
  }

  const goToInvoice = (id: number) => {
    navigation.navigate(Routes.Invoice, { invoiceId: id })
  }

  const createInvoice = () => {
    navigation.navigate(Routes.NewInvoice)
  }

  const invoices = useMemo(
    () => data?.pages.flatMap((page) => page.invoices),
    [data?.pages],
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.headerTxt}>Hi Jane,</Text>
      <Text style={styles.headerSubTxt}>Take a look at your invoices</Text>
      {isLoading && <ActivityIndicator color={'#000'} />}
      <FlatList
        data={invoices}
        renderItem={({ item }) => (
          <InvoiceCard invoice={item} onPressCard={goToInvoice} />
        )}
        contentContainerStyle={styles.list}
        onEndReached={getMoreInvoices}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item.id.toString()}
        style={styles.mainListStyle}
        testID="invoice-list"
      />
      <TouchableOpacity
        style={styles.plusContainer}
        onPress={createInvoice}
        testID="create-invoice-button"
      >
        <Image
          source={require('../assets/icons/plus.png')}
          style={styles.plus}
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home

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
  headerSubTxt: {
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    gap: 10,
    paddingBottom: 30,
  },
  mainListStyle: {
    flex: 1,
    marginTop: 10,
  },
  plus: {
    height: 30,
    width: 30,
  },
  plusContainer: {
    backgroundColor: '#27355e',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    right: 22,
    borderRadius: 100,
  },
})
