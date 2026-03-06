export const JUST_EAT_HOSTNAME = 'app.business.just-eat.co.uk';
export const JUST_EAT_HOMEPAGE_PATHNAME = 'my-meals';
const JUST_EAT_CART_API_PATHNAME = 'api/eaters/me/carts';
export const JUST_EAT_CART_API_URL = `https://${JUST_EAT_HOSTNAME}/${JUST_EAT_CART_API_PATHNAME}`

export const getMyMealsRestaurantUrl = (orderId: string) => {
    return `https://${JUST_EAT_HOSTNAME}/${JUST_EAT_HOMEPAGE_PATHNAME}/${orderId}`;
}