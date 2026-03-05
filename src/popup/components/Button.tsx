import type { ParentProps } from "solid-js";

type ButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  class?: string;
} & ParentProps;

export const Button = (props: ButtonProps) => {
  const baseClasses =
    "w-full rounded-md px-2 py-2 text-sm font-semibold transition focus:outline-none";

  const variantClasses =
    props.variant === "secondary"
      ? "border border-neutral-700 text-neutral-100 hover:bg-neutral-800"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      class={`${baseClasses} ${variantClasses} ${props.class || ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
