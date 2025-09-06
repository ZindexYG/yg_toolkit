import { createBrowserRouter } from "react-router";
import Layout from './Layout'
import Home from './Page/Home'
import User from './Page/Inbox'

export const router = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "Inbox", Component: User },
    ],
  },
];


export default createBrowserRouter(router)