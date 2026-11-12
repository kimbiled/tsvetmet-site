import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import ruRU from 'antd/locale/ru_RU'
import { Toaster } from 'sonner'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import WeightCalculator from './components/WeightCalculator'
import About from './components/About'
import Advantages from './components/Advantages'
import RequestForm from './components/RequestForm'
import Contacts from './components/Contacts'
import Requisites from './components/Requisites'
import Footer from './components/Footer'
import { antdTheme } from './theme'

export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={ruRU} theme={antdTheme} wave={{ disabled: true }}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержимому
        </a>
        <Header />
        <main id="main">
          <Hero />
          <Catalog />
          <WeightCalculator />
          <RequestForm />
          <Contacts />
          <About />
          <Advantages />
          <Requisites />
        </main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }}
        />
      </ConfigProvider>
    </StyleProvider>
  )
}
