import ToggleButton from '@popup//components/ToggleButton.tsx';
import { openInNewTabStore } from '@popup/stores/openInNewTabStore.ts';

export const OpenInNewTab = () => {
  const { value, updateValue } = openInNewTabStore;

  if (!value) {
    return <></>;
  }

  return (
    <ToggleButton
      prefix={'Enable new tab on choose order button'}
      isChecked={value.isEnabled}
      onClick={() => updateValue({ isEnabled: !value.isEnabled })}
    />
  );
};

export default OpenInNewTab;
