/**
 * Central brand identity config.
 *
 * Every place the brand name appears in the UI must read from BRAND_NAME so
 * the whole site can be renamed later by changing this one constant.
 */
export const BRAND_NAME = "OdooWebApps";

export const BRAND_TAGLINE = "A web app studio for businesses that already use Odoo.";

/** The person behind the studio, as named publicly. Used for bylines and schema. */
export const FOUNDER = {
  name: "Tal Oz",
  jobTitle: "Founder, Odoo integration developer",
  url: "https://odoowebapps.com/about#founder",
  /** Public profiles, added as they exist. */
  sameAs: [] as string[],
};
