import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Config from 'react-native-config'
import { ApiProvider } from './api'
import { ParamList } from './navigation/params'
import { Routes } from './navigation/routes'
import Home from './screens/Home'
import Invoice from './screens/Invoice'
import NewInvoice from './screens/NewInvoice'

const Stack = createNativeStackNavigator<ParamList>()

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider
        url={String(Config.API_URL)}
        token={String(Config.API_TOKEN)}
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={Routes.Home}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name={Routes.Home} component={Home} />
            <Stack.Screen
              name={Routes.Invoice}
              component={Invoice}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name={Routes.NewInvoice} component={NewInvoice} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApiProvider>
    </QueryClientProvider>
  )
}

export default App
