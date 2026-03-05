interface ToggleProps {
    id: string;
    isChecked: boolean;
    onChange: () => void;
    class?: string;
}

export const Toggle = (props: ToggleProps) => (
    <button
        type="button"
        role="switch"
        aria-checked={props.isChecked}
        id={props.id}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
            props.isChecked ? "bg-blue-600" : "bg-neutral-700"
        }
      ${props.class || ""}`}
        onClick={props.onChange}
    >
    <span
        class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            props.isChecked ? "translate-x-6" : "translate-x-1"
        }`}
    />
    </button>
);

export default Toggle;
