import type { JSX } from "solid-js";

export type Affix = string;
interface Affixes {
  prefix?: Affix;
  suffix?: Affix;
  wrapperClass?: string;
  prefixClass?: string;
  suffixClass?: string;
  children: JSX.Element;
}

export const Affixes = (props: Affixes) => (
  <div class={`flex items-center w-full text-sm ${props.wrapperClass || ""}`}>
    {props.prefix && (
      <span
        class={`inline-flex items-center px-2 py-2 rounded-l-md border border-r-0 border-neutral-700 bg-neutral-800 text-neutral-400 text-sm ${
          props.prefixClass || ""
        }`}
      >
        {props.prefix}
      </span>
    )}
    {props.children}
    {props.suffix && (
      <span
        class={`inline-flex items-center px-2 py-2 rounded-r-md border border-l-0 border-neutral-700 bg-neutral-800 text-neutral-400 text-sm ${
          props.suffixClass || ""
        }`}
      >
        {props.suffix}
      </span>
    )}
  </div>
);

export default Affixes;
