import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { EventDetailPage } from "./pages/EventDetailPage.tsx";
import Layout from "./layouts/Layout.tsx";
import EventDetailPageLayout from "./layouts/EventDetailPageLayout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
    ],
  },
  {
    path: "events/:id",
    Component: EventDetailPageLayout,
    children: [{ index: true, Component: EventDetailPage }],
  },
]);

export default router;
