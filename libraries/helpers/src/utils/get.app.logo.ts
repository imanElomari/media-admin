/**
 * Get the application logo path from environment variable or fallback to default based on IS_GENERAL flag
 * This allows customization of the logo via NEXT_PUBLIC_BRAND_LOGO environment variable
 * which can be passed through docker compose
 */
export const getAppLogo = () => {
  // Check if NEXT_PUBLIC_BRAND_LOGO is set (from docker-compose build args)
  if (process.env.NEXT_PUBLIC_BRAND_LOGO) {
    return process.env.NEXT_PUBLIC_BRAND_LOGO;
  }
  
  // Fallback to the original logic based on IS_GENERAL flag
  return process.env.IS_GENERAL ? '/postiz.svg' : '/logo.svg';
};
