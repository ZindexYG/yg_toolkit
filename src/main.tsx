import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { createBrowserRouter } from "react-router";
// import { RouterProvider } from "react-router/dom";
// import { router } from './routers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
