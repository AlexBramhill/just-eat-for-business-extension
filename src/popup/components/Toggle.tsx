interface ToggleProps {
  id: string;
  isChecked: boolean;
  class?: string;
}

export const Toggle = (props: ToggleProps) => (
  <span
    role="switch"
    aria-checked={props.isChecked}
    id={props.id}
    class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      props.isChecked ? 'bg-blue-600' : 'bg-neutral-700'
    }
      ${props.class || ''}`}
  >
    <span
      class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        props.isChecked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </span>
);

export default Toggle;
