import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

type Props = {
  onCheck: (val: boolean) => void
}
const Checkbox = ({ onCheck }: Props) => {
  const [checked, setChecked] = useState<boolean>(false)

  const handlePress = () => {
    setChecked((prev) => !prev)
    onCheck(!checked)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container]}
      hitSlop={20}
      testID="checkbox-container"
    >
      {checked && <Text>x</Text>}
    </TouchableOpacity>
  )
}

export default Checkbox

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {},
  unchecked: {},
})
