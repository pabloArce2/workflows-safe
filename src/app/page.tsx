import { redirect } from "next/navigation"

interface HomeParams {
    params: {
        locale: string
    }
}

export default function Home({ params: { locale } }: HomeParams) {
    redirect(`${locale}/workflows`)
}
