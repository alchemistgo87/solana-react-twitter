import { useEffect } from "react";

export const useAutoresizeTextarea = (element, stateValue) => {
  useEffect(() => {
    if (element && element.current) {
      element.current.style.height = "auto";
      element.current.style.height = element.current.scrollHeight + "px";
    }
  }, [element, stateValue]);
};
