import { getSodToday } from '@content/dateHelpers.ts';
import { JUST_EAT_CART_API_URL } from '@content/justEatPageList.ts';
import { logger } from '@shared/logger.ts';
import { z } from 'zod';

const JustEatEaterOptionSchema = z.object({
  orderHumanId: z.number(),
  orderId: z.string(),
});

const JustEatCartItemSchema = z.object({
  eaterOptions: z.array(JustEatEaterOptionSchema),
});

const JustEatCartInformationResponseSchema = z.object({
  items: z.array(JustEatCartItemSchema),
});

export type JustEatCartInformationResponse = z.infer<
  typeof JustEatCartInformationResponseSchema
>;
export type JustEatCartItem = z.infer<typeof JustEatCartItemSchema>;

export const getCartInformation =
  async (): Promise<JustEatCartInformationResponse> => {
    const now = getSodToday();
    const url = new URL(JUST_EAT_CART_API_URL);
    url.searchParams.set('from', now.toISOString());
    logger.debug(
      { url: url.toString() },
      'justEatClient: fetching cart information',
    );
    const response = await fetch(url, { credentials: 'include' });
    logger.debug({ response }, 'justEatClient: cart information received');
    const parsed = JustEatCartInformationResponseSchema.parse(
      await response.json(),
    );
    logger.debug(
      { response: parsed },
      'justEatClient: cart information parsed',
    );
    return parsed;
  };
