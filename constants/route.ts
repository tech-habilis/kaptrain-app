export const ROUTE_NAME = {
  MODAL: "modal",
  EXPLORE: "explore",
  SIGN_IN: "sign-in",
  TABS: "(tabs)",
  PROFILE: "profile",
  TIPS: "tips",
  ARTICLES: "articles",
  SIGN_UP: "sign-up",
  FORGOT_PASSWORD: "forgot-password",
  LANDING: "landing",
  ONBOARDING: "onboarding",
  VERIFY_EMAIL: "verify-email",
  EMAIL_VERIFIED: "email-verified",
  COMPLETE_PROFILE: "complete-profile",
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
  SIGN_UP: `/${ROUTE_NAME.SIGN_UP}` as const,
  FORGOT_PASSWORD: `/${ROUTE_NAME.FORGOT_PASSWORD}` as const,
  LANDING: `/${ROUTE_NAME.LANDING}` as const,
  ONBOARDING: `/${ROUTE_NAME.ONBOARDING}` as const,
  VERIFY_EMAIL: `/${ROUTE_NAME.VERIFY_EMAIL}` as const,
  EMAIL_VERIFIED: `/${ROUTE_NAME.EMAIL_VERIFIED}` as const,
  COMPLETE_PROFILE: `/${ROUTE_NAME.COMPLETE_PROFILE}` as const,
} as const;
