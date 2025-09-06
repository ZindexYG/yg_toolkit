import { createBrowserRouter } from "react-router";
import Home from './Page/Home'
import User from './Page/Inbox'

export const router = [
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "Inbox", Component: User },
    ],
  },
];


export default createBrowserRouter(router)