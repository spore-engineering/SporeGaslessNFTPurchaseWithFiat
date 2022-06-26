import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { theme as proTheme } from '@chakra-ui/pro-theme'
import '@fontsource/roboto'

function MyApp({ Component, pageProps }) {
  const theme = extendTheme(
    {
      fonts: {
        heading: 'Roboto, -apple-system, system-ui, sans-serif',
        body: 'Roboto, -apple-system, system-ui, sans-serif',
      },
    },
    proTheme,
  )
  
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;