export type TSession = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    // ... add other user data here
  };
};
