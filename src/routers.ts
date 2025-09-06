import { createBrowserRouter } from "react-router";
import User from './Page/Inbox'
import Home from './Page/Home'

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "Inbox", Component: User },
    ],
  },
]);

export default router