import { redirect } from "next/navigation"

interface HomeParams {
  params: {
    locale: string
  }
}

export default function Home({ params: { locale } }: HomeParams) {
  if (!locale) {
    redirect("/")
  }
  return (
    <div>
      <h1>Welcome to {locale} page</h1>
    </div>
  )
}
