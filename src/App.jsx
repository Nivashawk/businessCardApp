import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { SafeAreaView, StyleSheet } from 'react-native';
import RootNavigator from './navigation/rootNavigation';
import Toast from 'react-native-toast-message';
import { authUser } from './redux/slices/auth/authSlices';
import { odooConnect } from './redux/slices/auth/odooConnectSlices';


// ✅ AuthWrapper component that lives inside the Provider
const AuthWrapper = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth?.data?.result?.is_admin);
  console.log("isAuthenticated", isAuthenticated);
  

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(odooConnect());
    }
    else{
      dispatch(authUser());
    }
  }, [isAuthenticated, dispatch]);
  

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
