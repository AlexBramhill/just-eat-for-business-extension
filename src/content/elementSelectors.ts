export const selectElementByTestId = (
    testIdName: string,
    container: HTMLElement = document.body
): HTMLElement | null => {
    return container.querySelector(`[test-id="${testIdName}"]`);
};

export const selectElementsByTestId = (
    testIdName: string,
    container: HTMLElement = document.body
): HTMLElement[] => {
    return Array.from(
        container.querySelectorAll(`[test-id="${testIdName}"]`)
    );
};
