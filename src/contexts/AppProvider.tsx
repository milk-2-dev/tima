import { FiltersProvider } from "./FiltersContext";
import { EventsProvider } from "./EventsContext";

export function AppProvider({ children }) {
  return (
    <FiltersProvider>
      <EventsProvider>{children}</EventsProvider>
    </FiltersProvider>
  );
}

{
  /* <ThemeProvider>
  <AuthProvider>
    <NotificationProvider>{children}</NotificationProvider>
  </AuthProvider>
</ThemeProvider>; */
}
