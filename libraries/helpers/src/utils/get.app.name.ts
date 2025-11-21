/**
 * Get the application name from environment variable or fallback to default based on IS_GENERAL flag
 * This allows customization of the page titles via NEXT_PUBLIC_BRAND_TITLE environment variable
 * which can be passed through docker compose
 */
export const getAppName = () => {
  // Check if NEXT_PUBLIC_BRAND_TITLE is set (from docker-compose build args)
  if (process.env.NEXT_PUBLIC_BRAND_TITLE) {
    return process.env.NEXT_PUBLIC_BRAND_TITLE;
  }
  
  // Fallback to the original logic based on IS_GENERAL flag
  return process.env.IS_GENERAL ? 'Postiz' : 'Gitroom';
};
