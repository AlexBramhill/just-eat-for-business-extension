import ToggleButton from "../components/ToggleButton.tsx";
import {newTabToggleStore} from "../stores/newTabToggleStore.ts";

export const NewTabToggle = () => {
    const {value, updateValue} = newTabToggleStore
    return (
        <ToggleButton prefix={"Enable new tab on choose order button"} isChecked={value.isEnabled}
                      onClick={() => updateValue({isEnabled: !value.isEnabled})}/>
    );
}

export default NewTabToggle;