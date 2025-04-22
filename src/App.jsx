import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {SafeAreaView, StyleSheet} from 'react-native';
import RootNavigator from './navigation/rootNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
      <Provider store={store}>
          <SafeAreaView style={styles.safeArea}>
            <RootNavigator />
            <Toast />
          </SafeAreaView>
      </Provider>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  safeArea: {flex: 1},
});

export default App;
