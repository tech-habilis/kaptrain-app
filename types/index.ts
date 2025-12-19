export type TSession = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
    // ... add other user data here
  };
};
