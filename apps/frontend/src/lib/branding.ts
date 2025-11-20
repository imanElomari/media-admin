// Centralized branding helper
// Use NEXT_PUBLIC_ env vars so values are embedded at build time
export const BRAND_TITLE: string =
  process.env.NEXT_PUBLIC_BRAND_TITLE || 'Default Title';

export const BRAND_LOGO: string =
  process.env.NEXT_PUBLIC_BRAND_LOGO || '/postiz.svg';

export default {
  BRAND_TITLE,
  BRAND_LOGO,
};
