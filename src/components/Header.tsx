import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  title: string
  onGoBack: () => void
}

const Header = ({ title, onGoBack }: Props) => {
  return (
    <SafeAreaView style={styles.container} testID="header-container">
      <TouchableOpacity
        onPress={onGoBack}
        style={styles.titleArrow}
        testID="header-back-button"
      >
        <Image
          source={require('../assets/icons/left-arrow.png')}
          style={styles.arrow}
        />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {},
  arrow: {
    height: 17,
    width: 15,
  },
  titleArrow: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
})
