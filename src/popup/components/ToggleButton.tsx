import {Button} from "./Button";
import {Toggle} from "./Toggle";
import type {Affix} from "./Affixes";

interface ToggleButtonProps {
    id?: string;
    isChecked: boolean;
    onClick: () => void;
    prefix?: Affix;
    suffix?: Affix;
    class?: string;
}

export const ToggleButton = (props: ToggleButtonProps) => {
    return (
        <Button
            onClick={props.onClick}
            variant="secondary"
            class={`flex items-center justify-between ${props.class || ""}`}
        >
            {props.prefix && (
                <span class="mr-3 text-neutral-300">{props.prefix}</span>
            )}

            <Toggle
                id={props.id || "toggle-button"}
                isChecked={props.isChecked}
                onChange={() => {
                }}
                class="pointer-events-none"
            />

            {props.suffix && (
                <span class="ml-3 text-neutral-300">{props.suffix}</span>
            )}
        </Button>
    );
};

export default ToggleButton;
