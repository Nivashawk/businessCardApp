// headerOptions.js
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TouchableOpacity, Text, Image } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';


export const getHeaderOptions = ({ route, navigation }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const hideHeaderScreens = ['ScanQR', 'CreateBusiness', 'CustomCamera'];
  const showHeader = !hideHeaderScreens.includes(routeName);

  return {
    headerShown: showHeader,
    headerStyle: {
      backgroundColor: colors.secondary,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      elevation: 4,
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'left',
    headerTitle: ({ route }) => {
      const routeName = route.name; // Get the route name directly from the route object
      console.log(routeName); // Log the current route name
      
      return routeName === 'Home' ? (
        <Text style={typography.heading}>LOGO</Text>
        // <Image
        //   source={require('../assets/logo.png')}
        //   style={{ width: 120, height: 40, resizeMode: 'contain' }}
        // />
      ) : (
        <Text style={[typography.description, { width: '80%', flexDirection: 'row' }]}>
          {routeName}
        </Text>
      );
    },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MenuScreen');
        }}
        style={{ marginRight: 15 }}
      >
        <Text style={{ color: colors.primary, fontSize: 16 }}>Menu</Text>
      </TouchableOpacity>
    ),
  };
};

