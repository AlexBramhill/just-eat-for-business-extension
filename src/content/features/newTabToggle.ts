import type {Feature} from "./features.ts";
import {selectElementByTestId, selectElementsByTestId} from "../elementSelectors.ts";
import {cartCache} from "../cache/cartCache.ts";
import {
    type CartCacheStorage,
    newTabToggleDefaultValue,
    NewTabToggleStorageSchema,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {z} from "zod";
import {getMyMealsRestaurantUrl} from "../justEatPageList.ts";
import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {logger} from "../../shared/logger.ts";
import {CHOOSE_MEAL_BUTTON_TEST_ID, EATER_OPTION_CARD_TEST_ID, ORDER_HUMAN_ID_TEST_ID} from "../elementNames.ts";
// TODO: rename newtabtoggle to something more descriptive, like "openInNewTab"

const getCardsWithChooseButton = (cards: HTMLElement[]) => cards.filter((card) => {
    const chooseButton = selectElementByTestId(CHOOSE_MEAL_BUTTON_TEST_ID, card);
    return chooseButton !== null;
});

const getIdFromHumanId = (humanOrderId: number, cartCacheStorage: CartCacheStorage) => {
    const order = cartCacheStorage.items.find((order) => order.humanOrderId === humanOrderId);
    return order?.orderId;
};

export const newTabToggle: Feature = {
    async shouldRun(): Promise<boolean> {
        const store = createStorageConnection(STORAGE_KEYS.NEW_TAB_TOGGLE, NewTabToggleStorageSchema, newTabToggleDefaultValue)
        const isEnabled = (await store.get()).isEnabled;
        logger.debug({isEnabled}, "newTabToggle.shouldRun");
        return isEnabled;
    },
    async run(): Promise<void> {
        const cards = selectElementsByTestId(EATER_OPTION_CARD_TEST_ID);
        logger.debug({cards}, `newTabToggle.run: found ${EATER_OPTION_CARD_TEST_ID} cards`);

        const cardsWithChooseButton = getCardsWithChooseButton(cards);
        logger.debug({cardsWithChooseButton}, "newTabToggle.run: cards with choose button");

        const cartCacheStorage = await cartCache.get();

        let replaced = 0;
        cardsWithChooseButton.forEach((card) => {
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
            }, "newTabToggle.run: replacing button with link");

            const link = document.createElement("a");
            link.href = myMealsRestaurantUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = button.textContent;
            link.className = button.className;

            button.replaceWith(link);
            replaced++;
        });

        logger.debug({replaced}, "newTabToggle.run: done");
    }

}

export default newTabToggle;