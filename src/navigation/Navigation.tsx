import React, { useEffect } from 'react';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from '../redux/store/store';

import Home from '../screens/Home';
import { loadTodos } from '../utils/persistence';
import { hydrateTodos, setLoadFalse } from '../redux/action/action';

const Stack = createStackNavigator();

function Navigation(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      try {
        const savedState = await loadTodos();
        if (savedState) {
          store.dispatch(hydrateTodos(savedState));
        }
      } catch (e) {
        store.dispatch(hydrateTodos([]));
      } finally {
        store.dispatch(setLoadFalse());
      }
    };

    init();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: '#fff',
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default Navigation;
