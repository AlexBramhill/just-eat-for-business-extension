import type {Feature} from "./features.ts";
import {selectElementByTestId, selectElementsByTestId} from "../elementSelectors.ts";
import {cartCache} from "../cache/cartCache.ts";
import type {CartCacheStorage} from "../../shared/repositories/storageSchemas.ts";
import {z} from "zod";
import {getMyMealsRestaurantUrl} from "../justEatPageList.ts";

const getCardsWithChooseButton = (cards: HTMLElement[]) => cards.filter((card) => {
    const chooseButton = selectElementByTestId("button", card);
    return chooseButton !== null;
});

const getIdFromHumanId = (humanOrderId: number, cartCacheStorage: CartCacheStorage) => {
    const order = cartCacheStorage.items.find((order) => order.humanOrderId === humanOrderId);
    return order?.orderId;

};

export const newTabToggle: Feature = {
    shouldRun(): boolean {
        return true; // TODO: Link this up with button
    },
    async run(): Promise<void> {
        const cards = selectElementsByTestId("eaterOption");

        const cardsWithChooseButton = getCardsWithChooseButton(cards);

        const cartCacheStorage = await cartCache.get();

        cardsWithChooseButton.forEach((card) => {

            const humanIdElement = selectElementByTestId("orderHumanId", card);
            const rawHumanOrderIdText = humanIdElement?.textContent?.trim().replace('- Order ', '');
            const humanOrderId = z.coerce.number().safeParse(rawHumanOrderIdText);

            if (!humanOrderId.success) {
                console.warn("Could not find human ID for card, skipping:", card);
                return;
            }

            const id = getIdFromHumanId(humanOrderId.data, cartCacheStorage);
            if (!id) {
                console.warn("Could not find order ID for human ID, skipping:", humanOrderId.data);
                return;
            }

            const button = selectElementByTestId("chooseMeal", card);
            if (!button) {
                console.warn("Could not find choose button for card, skipping:", card);
                return;
            }

            const myMealsRestaurantUrl = getMyMealsRestaurantUrl(id);

            const link = document.createElement("a");
            link.href = myMealsRestaurantUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = button.textContent;
            link.className = button.className;

            button.replaceWith(link);
        });
    }

}

export default newTabToggle;