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
};

export default Config;
