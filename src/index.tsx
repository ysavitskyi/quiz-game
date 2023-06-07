import React from 'react'
import ReactDOM from 'react-dom/client'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { NhostClient, NhostProvider } from '@nhost/react'

import App from './App'

export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_SUBDOMAIN,
  region: process.env.REACT_APP_REGION,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <App />
      </NhostApolloProvider>
    </NhostProvider>
  </React.StrictMode>
)
