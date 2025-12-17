export const ROUTE_NAME = {
  MODAL: "modal",
  EXPLORE: "explore",
  SIGN_IN: "sign-in",
  TABS: "(tabs)",
  PROFILE: "profile",
  TIPS: "tips",
  ARTICLES: "articles",
} as const;

/**
 * type-safe route constants to be used on the app
 */
export const ROUTE = {
  ROOT: "/" as const,
  SIGN_IN: `/${ROUTE_NAME.SIGN_IN}` as const,
  TABS: `/${ROUTE_NAME.TABS}` as const,
  MODAL: `/${ROUTE_NAME.MODAL}` as const,
  EXPLORE: `/${ROUTE_NAME.TABS}/${ROUTE_NAME.EXPLORE}` as const,
  PROFILE: `/${ROUTE_NAME.TABS}/${ROUTE_NAME.PROFILE}` as const,
  TIPS: `/${ROUTE_NAME.TABS}/${ROUTE_NAME.TIPS}` as const,
  ARTICLES: `/${ROUTE_NAME.TABS}/${ROUTE_NAME.ARTICLES}` as const,
} as const;
