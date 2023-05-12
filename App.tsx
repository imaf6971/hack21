import { NavigationContainer } from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './src/screens/NavBar';

const queryClient = new QueryClient();
export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </QueryClientProvider >
    </GestureHandlerRootView>
  )
}
