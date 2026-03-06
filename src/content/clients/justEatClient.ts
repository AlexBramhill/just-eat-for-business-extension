import {JUST_EAT_CART_API_URL} from "../justEatPageList.ts";
import {getSodToday} from "../dateHelpers.ts";
import {z} from "zod";

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
    const response = await fetch(url, {credentials: 'include'});
    return JustEatCartInformationResponseSchema.parse(await response.json());
}