import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { SafeAreaView, StyleSheet } from 'react-native';
import RootNavigator from './navigation/rootNavigation';
import Toast from 'react-native-toast-message';
import { authUser } from './redux/slices/auth/authSlices';


// ✅ AuthWrapper component that lives inside the Provider
const AuthWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('Redux store:', store); // should NOT be undefined
     dispatch(authUser());
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        {/* Dispatches authUser() inside a valid Redux Provider */}
        <AuthWrapper />
        <RootNavigator />
        <Toast />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});

export default App;
