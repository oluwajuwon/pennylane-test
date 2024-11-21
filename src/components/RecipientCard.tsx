import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Components } from '../api/generated/client'

type Props = {
  customer: Components.Schemas.Customer
  onPress: () => void
  showCloseIcon?: boolean
  isDisabled?: boolean
}

const RecipientCard = ({
  customer,
  onPress,
  isDisabled,
  showCloseIcon,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text>
        {customer.first_name} {customer.last_name}
      </Text>
      {showCloseIcon && <Text>X</Text>}
    </TouchableOpacity>
  )
}

export default RecipientCard

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginVertical: 5,
  },
})
