import type {Feature} from "./features.ts";
import {selectElementByTestId, selectElementsByTestId} from "../elementSelectors.ts";
import {cartCache} from "../cache/cartCache.ts";
import {
    type CartCacheStorage,
    newTabToggleDefaultValue,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {z} from "zod";
import {getMyMealsRestaurantUrl} from "../justEatPageList.ts";
import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {logger} from "../../shared/logger.ts";

const getCardsWithChooseButton = (cards: HTMLElement[]) => cards.filter((card) => {
    const chooseButton = selectElementByTestId("button", card);
    return chooseButton !== null;
});

const getIdFromHumanId = (humanOrderId: number, cartCacheStorage: CartCacheStorage) => {
    const order = cartCacheStorage.items.find((order) => order.humanOrderId === humanOrderId);
    return order?.orderId;

};

export const newTabToggle: Feature = {
    async shouldRun(): Promise<boolean> {
        const store = createStorageConnection(STORAGE_KEYS.NEW_TAB_TOGGLE, newTabToggleDefaultValue)
        const isEnabled = (await store.get()).isEnabled;
        logger.debug({ isEnabled }, "newTabToggle.shouldRun");
        return isEnabled;
    },
    async run(): Promise<void> {
        const cards = selectElementsByTestId("eaterOption");
        logger.debug({ count: cards.length }, "newTabToggle.run: found eaterOption cards");

        const cardsWithChooseButton = getCardsWithChooseButton(cards);
        logger.debug({ count: cardsWithChooseButton.length }, "newTabToggle.run: cards with choose button");

        const cartCacheStorage = await cartCache.get();

        let replaced = 0;
        cardsWithChooseButton.forEach((card) => {

            const humanIdElement = selectElementByTestId("orderHumanId", card);
            const rawHumanOrderIdText = humanIdElement?.textContent?.trim().replace('- Order ', '');
            const humanOrderId = z.coerce.number().safeParse(rawHumanOrderIdText);

            if (!humanOrderId.success) {
                logger.warn({ rawText: rawHumanOrderIdText }, "Could not find human ID for card, skipping");
                return;
            }

            const id = getIdFromHumanId(humanOrderId.data, cartCacheStorage);
            if (!id) {
                logger.warn({ humanOrderId: humanOrderId.data }, "Could not find order ID for human ID, skipping");
                return;
            }

            const button = selectElementByTestId("chooseMeal", card);
            if (!button) {
                logger.warn({ humanOrderId: humanOrderId.data }, "Could not find choose button for card, skipping");
                return;
            }

            const myMealsRestaurantUrl = getMyMealsRestaurantUrl(id);
            logger.debug({ humanOrderId: humanOrderId.data, orderId: id, url: myMealsRestaurantUrl }, "newTabToggle.run: replacing button with link");

            const link = document.createElement("a");
            link.href = myMealsRestaurantUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = button.textContent;
            link.className = button.className;

            button.replaceWith(link);
            replaced++;
        });

        logger.debug({ replaced }, "newTabToggle.run: done");
    }

}

export default newTabToggle;