import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { EventDetailPage } from "./pages/EventDetailPage.tsx";
import Layout from "./layouts/Layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      { path: "events/:id", Component: EventDetailPage },
    ],
  },
]);

export default router;
