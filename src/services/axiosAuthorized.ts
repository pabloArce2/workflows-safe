import Paths from "@/router/paths"
import rootStore from "@/stores/RootStore"
import axios, { AxiosResponse } from "axios"

import { toast } from "@/hooks/useToast"

import authService from "./auth.service"

const axiosAuthorized = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_SERVER_API_ENDPOINT,
})

// Interceptor para añadir token y projectId
axiosAuthorized.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        const organizationId = rootStore.organizationStore.idOrganization
        const projectId = rootStore.projectStore.idProject

        // Check if the URL already contains '/organizations/{id}' or is a whoAmI
        const isWhoAmIRequest = config?.url?.includes('/whoami');
        const organizationUrlPattern = `/organizations/${organizationId}`

        if (!isWhoAmIRequest && !config?.url?.startsWith(organizationUrlPattern)) {
            //  models
            if (organizationId && config?.url &&
                (config.url.includes(`/${Paths.MODELS}/`))
            ) {
                config.url = `${organizationUrlPattern}${config.url}`
            }
            // Construct the new base URL with organizationId and projectId
            else if (
                organizationId &&
                projectId &&
                config?.url &&
                (config.url.includes(`/${Paths.DATASETS}/`) ||
                    config.url.includes(`/${Paths.TASK}/`))
            ) {

                config.url = `${organizationUrlPattern}/${Paths.PROJECTS}/${projectId}${config.url}`
            }
            else if (organizationId) {
                // Add only organizationId if projectId is not relevant for the URL
                config.url = `${organizationUrlPattern}${config.url}`
            }


        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar respuestas y errores de autenticación
axiosAuthorized.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: any) => {
        if (error.response) {
            const status = error.response.status

            switch (status) {
                case 400:
                    toast({
                        title: "Oops! Something went wrong with your request. Please check the data and try again.",
                    })
                    break

                case 401:
                    //alertsService.info("La sesión ha expirado")
                    authService.logout()
                    window.dispatchEvent(new Event("unauthorizedError"))
                    toast({ title: "Unauthorized! Please log in to access this resource." })
                    break

                case 403:
                    toast({ title: "Sorry, you don't have permission to access this resource." })
                    break

                case 404:
                    toast({ title: "The requested resource could not be found. Please check the URL." })
                    break

                case 405:
                    toast({
                        title: "Method Not Allowed! The requested method is not supported for this resource.",
                    })
                    break

                case 408:
                    toast({ title: "Request Timeout! The server timed out waiting for the request." })
                    break

                case 413:
                    toast({
                        title: "Payload Too Large! The request payload is larger than the server can handle.",
                    })
                    break

                case 415:
                    toast({ title: "Unsupported Media Type! The server does not support the request media type." })
                    break

                case 429:
                    toast({
                        title: "Slow down! You've exceeded the maximum number of requests. Please try again later.",
                    })
                    break

                case 502:
                    toast({
                        title: "Bad Gateway! There's an issue with the server connection. Please try again later.",
                    })
                    break

                case 503:
                    toast({
                        title: "Service Unavailable! The server is currently unable to handle the request due to temporary overloading or maintenance of the server.",
                    })
                    break

                case 504:
                    toast({
                        title: "Gateway Timeout! The server took too long to respond. Please try again in a moment.",
                    })
                    break

                default:
                    toast({ title: "Oops! Something went wrong. Please try again later or contact support." })
            }
        } else if (error.message === "Network Error") {
            toast({ title: "Network Error! Please check your internet connection and try again." })
        }

        return Promise.reject(error)
    }
)

export default axiosAuthorized
