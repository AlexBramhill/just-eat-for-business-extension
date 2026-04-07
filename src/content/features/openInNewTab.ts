import type {Feature} from "./features.ts";
import {selectElementByTestId, selectElementsByTestId} from "../elementSelectors.ts";
import {cartCache} from "../cache/cartCache.ts";
import {
    type CartCacheStorage,
    openInNewTabDefaultValue,
    OpenInNewTabStorageSchema,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {z} from "zod";
import {getMyMealsRestaurantUrl} from "../justEatPageList.ts";
import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {logger} from "../../shared/logger.ts";
import {CHOOSE_MEAL_BUTTON_TEST_ID, EATER_OPTION_CARD_TEST_ID, ORDER_HUMAN_ID_TEST_ID} from "../elementNames.ts";

const getCardsWithChooseButton = (cards: HTMLElement[]) => cards.filter((card) => {
    const chooseButton = selectElementByTestId(CHOOSE_MEAL_BUTTON_TEST_ID, card);
    return chooseButton !== null;
});

const getIdFromHumanId = (humanOrderId: number, cartCacheStorage: CartCacheStorage) => {
    const order = cartCacheStorage.items.find((order) => order.humanOrderId === humanOrderId);
    return order?.orderId;
};

export const openInNewTab: Feature = {
    async shouldRun(): Promise<boolean> {
        const store = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, OpenInNewTabStorageSchema, openInNewTabDefaultValue)
        const isEnabled = (await store.get()).isEnabled;
        logger.debug({isEnabled}, "openInNewTab.shouldRun");
        return isEnabled;
    },
    async run(): Promise<void> {
        const cards = selectElementsByTestId(EATER_OPTION_CARD_TEST_ID);
        logger.debug({cards}, `openInNewTab.run: found ${EATER_OPTION_CARD_TEST_ID} cards`);

        const cardsWithChooseButton = getCardsWithChooseButton(cards);
        logger.debug({cardsWithChooseButton}, "openInNewTab.run: cards with choose button");

        const cartCacheStorage = await cartCache.get();

        cardsWithChooseButton.forEach(x => updateCardButtonWithLink(x, cartCacheStorage));
    }
}

const updateCardButtonWithLink = (card: HTMLElement, cartCacheStorage: CartCacheStorage) => {
    const humanIdElement = selectElementByTestId(ORDER_HUMAN_ID_TEST_ID, card);
    const rawHumanOrderIdText = humanIdElement?.textContent?.trim().replace('- Order ', '');
    const humanOrderId = z.coerce.number().safeParse(rawHumanOrderIdText);

    if (!humanOrderId.success) {
        logger.warn({rawText: rawHumanOrderIdText}, "Could not find human ID for card, skipping");
        return;
    }

    const id = getIdFromHumanId(humanOrderId.data, cartCacheStorage);
    if (!id) {
        logger.warn({humanOrderId: humanOrderId.data}, "Could not find order ID for human ID, skipping");
        return;
    }

    const button = selectElementByTestId(CHOOSE_MEAL_BUTTON_TEST_ID, card);
    if (!button) {
        logger.warn({humanOrderId: humanOrderId.data}, "Could not find choose button for card, skipping");
        return;
    }

    const myMealsRestaurantUrl = getMyMealsRestaurantUrl(id);

    logger.debug({
        humanOrderId: humanOrderId.data,
        orderId: id,
        url: myMealsRestaurantUrl
    }, "openInNewTab.run: replacing button with link");
    const link = createLinkElement(myMealsRestaurantUrl, button);

    button.replaceWith(link);
};

const createLinkElement = (myMealsRestaurantUrl: string, button: HTMLElement) => {
    const link = document.createElement("a");
    link.href = myMealsRestaurantUrl;
    link.textContent = button.textContent;
    link.className = button.className;
    return link;
};

export default openInNewTab;
