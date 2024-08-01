import { redirect } from "next/navigation"

interface HomeParams {
  params: {
    locale: string
  }
}

const validLocales = ["en", "es", "fr"]

export default function Home({ params: { locale } }: HomeParams) {
  // Check for valid locale before redirect
  if (!locale || !validLocales.includes(locale)) {
    redirect("/workflows")
  }

  return (
    <div>
      <h1>Welcome to the {locale} page</h1>
    </div>
  )
}
