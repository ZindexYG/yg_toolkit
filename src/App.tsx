import Layout from '@/Layout'
import { RouterProvider } from "react-router/dom";
import { router } from './routers'

function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  )
}

export default App
