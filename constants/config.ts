const Config = {
  /**
   * The length of the OTP code.
   * Supabase requires at least 6 digits.
   */
  OTP_LENGTH: 6,

  /**
   * Supabase default: 60 seconds
   */
  OTP_RESEND_DELAY: 60, // 60 seconds

  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  SUPABASE_STORAGE_BUCKET_NAME: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!,
};

export default Config;
