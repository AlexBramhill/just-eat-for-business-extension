import {JUST_EAT_CART_API_URL} from "../justEatPageList.ts";
import {getSodToday} from "../dateHelpers.ts";
import {z} from "zod";
import {logger} from "../../shared/logger.ts";

const JustEatCartItemSchema = z.object({
    eaterOptions: z.object({
        orderHumanId: z.number(),
        orderId: z.string(),
    }),
});

const JustEatCartInformationResponseSchema = z.object({
    items: z.array(JustEatCartItemSchema),
});

export type JustEatCartInformationResponse = z.infer<typeof JustEatCartInformationResponseSchema>;
export type JustEatCartItem = z.infer<typeof JustEatCartItemSchema>;

export const getCartInformation = async (): Promise<JustEatCartInformationResponse> => {
    const now = getSodToday();
    const url = new URL(JUST_EAT_CART_API_URL);
    url.searchParams.set('from', now.toISOString());
    logger.debug({ url: url.toString() }, "justEatClient: fetching cart information");
    const response = await fetch(url, {credentials: 'include'});
    const parsed = JustEatCartInformationResponseSchema.parse(await response.json());
    logger.debug({ itemCount: parsed.items.length }, "justEatClient: cart information received");
    return parsed;
}