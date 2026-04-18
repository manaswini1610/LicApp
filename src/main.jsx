import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.jsx'
import ContextState from './context/contextState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3a63f3',
          colorInfo: '#3a63f3',
          colorSuccess: '#12b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 14,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Card: {
            borderRadiusLG: 18,
          },
          Button: {
            borderRadius: 10,
            controlHeight: 40,
          },
          Input: {
            borderRadius: 10,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 10,
            controlHeight: 40,
          },
        },
      }}
    >
      <BrowserRouter>
        <ContextState>
          <App />
        </ContextState>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
