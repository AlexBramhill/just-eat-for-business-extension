import {JUST_EAT_CART_API_URL} from "../justEatPageList.ts";
import {getSodToday} from "../dateHelpers.ts";

type JustEatCartInformationResponse = {
    items: JustEatCartItem[]
}

type JustEatCartItem = {
    eaterOptions: {
        orderHumanId: number;
        orderId: string;
    }
}

export const getCartInformation = async () => {
    const now = getSodToday();
    const url = new URL(JUST_EAT_CART_API_URL);
    url.searchParams.set('from', now.toISOString());
    const response = await fetch(url, {credentials: 'include'});
    return await response.json() as Promise<JustEatCartInformationResponse>;
}