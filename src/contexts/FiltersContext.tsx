import { createContext, useContext, useState } from "react";

export const FiltersContext = createContext({});

// 2. Створення Provider компонента
export function FiltersProvider({ children }) {
  const [value, setValue] = useState({});

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  const contextValue = {
    value,
    updateValue,
  };

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  );
}
