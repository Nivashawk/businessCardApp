import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {SafeAreaView} from 'react-native';
import RootNavigator from './navigation/rootNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <RootNavigator />
        <Toast />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
