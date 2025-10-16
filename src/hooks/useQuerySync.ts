import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

export function useQuerySync<T extends Record<string, any>>(
  filters: T,
  setFilters: (f: T) => void,
  defaults: Partial<T> = {}
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const paramsObj: Record<string, any> = {};
    searchParams.forEach((value, key) => (paramsObj[key] = value));

    const hasParams = Object.keys(paramsObj).length > 0;
    const initial = hasParams ? { ...defaults, ...paramsObj } : { ...defaults };

    setFilters((prev) => {
      return { ...prev, ...initial };
    });

    if (!hasParams) {
      const params = new URLSearchParams();
      Object.entries(defaults).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
      });
      setSearchParams(params, { replace: true });
    }

    initialized.current = true;

    return () => {
      initialized.current = false;
    };
  }, []);

  useEffect(() => {
    if (!initialized.current || Object.keys(filters).length === 0) return;
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams: Record<string, string> = {};

    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== "") newParams[k] = String(v);
    });

    const currentStr = JSON.stringify(currentParams);
    const newStr = JSON.stringify(newParams);

    if (currentStr !== newStr) {
      setSearchParams(newParams, { replace: true });
    }
  }, [filters]);
}
