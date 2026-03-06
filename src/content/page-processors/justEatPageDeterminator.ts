export const isOnJustEatPage = async () => {
    const justEatHostname = 'app.business.just-eat.co.uk';
    const currentPageUrl = new URL(window.location.href);

    return justEatHostname === removeWwwPrefix(currentPageUrl.hostname);
};

const removeWwwPrefix = (hostname: string): string => {
    return hostname.replace(/^www\./, "");
};
