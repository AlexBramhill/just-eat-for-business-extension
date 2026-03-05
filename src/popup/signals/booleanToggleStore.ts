import { createSignal } from "solid-js";

export const createBooleanToggle = (initialValue: boolean = false) => {
  const [value, setValue] = createSignal(initialValue);

  const toggleValue = () => setValue((v) => !v);

return [value, toggleValue] as const;
};
