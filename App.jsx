// App.jsx

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.box}>
        <Text style={styles.text}>🚀 Hello from React Native!</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  box: {
    margin: 20,
    padding: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
