import { ChakraProvider } from "@chakra-ui/react";
import theme from "../components/theme";
import { Provider } from 'react-redux';
import store from '../store/store';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
      <Component {...pageProps}   />
      </Provider>
    </ChakraProvider>
  );
}

export default App;