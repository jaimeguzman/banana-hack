// import { NextUIProvider } from '@nextui-org/react'
import { NextUIProvider } from '@nextui-org/react'
import { ProcessProvider } from '../context/ProcessContext'
import { Toaster } from 'react-hot-toast'
import '../global.css'

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <ProcessProvider>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </ProcessProvider>
    </NextUIProvider>
  )
}

export default MyApp
