import { NavigationContainer } from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { NavBar } from './src/screens/NavBar';

const queryClient = new QueryClient();
export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    </QueryClientProvider >
  )
}
