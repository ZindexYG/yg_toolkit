import { RouterProvider } from 'react-router/dom'
import Layout from '@/Layout'
import router from './routers'

function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  )
}

export default App
