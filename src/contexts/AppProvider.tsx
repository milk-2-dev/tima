import { FiltersProvider } from "./FiltersContext";

export function AppProvider({ children }) {
  return <FiltersProvider>{children}</FiltersProvider>;
}

{
  /* <ThemeProvider>
  <AuthProvider>
    <NotificationProvider>{children}</NotificationProvider>
  </AuthProvider>
</ThemeProvider>; */
}
