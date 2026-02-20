import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import GlobalError from './components/GlobalError.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalError>
      <App />
    </GlobalError>
  </StrictMode>,
)
