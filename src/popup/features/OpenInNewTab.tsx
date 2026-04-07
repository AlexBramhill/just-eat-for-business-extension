import ToggleButton from "../components/ToggleButton.tsx";
import {openInNewTabStore} from "../stores/openInNewTabStore.ts";

export const OpenInNewTab = () => {
    const {value, updateValue} = openInNewTabStore
    return (
        <ToggleButton prefix={"Enable new tab on choose order button"} isChecked={value.isEnabled}
                      onClick={() => updateValue({isEnabled: !value.isEnabled})}/>
    );
}

export default OpenInNewTab;
