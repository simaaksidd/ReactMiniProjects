import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Fragment } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MainContent from './MainContent.jsx'
import App from './App.jsx'

const root = createRoot(document.getElementById("root"))

function Page() {
  return (
    <Fragment>
      <Header></Header>
      <MainContent></MainContent>
      <Footer></Footer>
    </Fragment>
  )
}


root.render (
  <StrictMode>
    <App></App>
    <Page></Page>
  </StrictMode>
)

