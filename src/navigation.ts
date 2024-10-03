import { Pathnames, createLocalizedPathnamesNavigation } from "next-intl/navigation"

export const locales = ["en", "es"] as const

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  "/": "/",
  // '/blog': '/blog',

  // If locales use different paths, you can
  // specify each external path per locale.
  // '/pricing': {
  //   en: '/pricing',
  //   es: '/precio'
  // },

  // Dynamic params are supported via square brackets
  // '/blog/[slug]': {
  //   en: '/news/[articleSlug]-[articleId]',
  //   es: '/noticias/[articleSlug]-[articleId]'
  // },

  // Also (optional) catch-all segments are supported
  // '/categories/[...slug]': {
  //   en: '/categories/[...slug]',
  //   es: '/categorias/[...slug]'
  // }
} satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter, getPathname } = createLocalizedPathnamesNavigation({
  locales,
  pathnames,
})
