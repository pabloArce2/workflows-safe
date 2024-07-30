import { BackendNodesResponse } from "@/context/BackendContext"
import { nodes_test_data } from "@/mocks/data"
import { AxiosError, AxiosResponse } from "axios"

import { NewWorkflow, Workflow, WorkflowResponse } from "@/types/workflow"
import { buildFilteredUrl } from "@/lib/utils"

import axiosAuthorized from "./axiosAuthorized"

export class WorkflowsService {
    createWorkflow(label_type: "rectangle" | "polygon", payload: NewWorkflow): Promise<WorkflowResponse> {
        return axiosAuthorized
            .post(`/workflows/?label_type=${label_type}`, payload)
            .then((response) => response.data)
            .catch((error) => console.log(error))
    }

    getWorkflowById(id_workflow: string): Promise<Workflow> {
        return axiosAuthorized
            .get(`/workflows/${id_workflow}`)
            .then((response: AxiosResponse) => response.data)
            .catch((error: AxiosError) => console.log(error))
    }

    getNodes(): Promise<BackendNodesResponse> {
        return axiosAuthorized
            .get(`/nodes`)
            .then((response: AxiosResponse) => nodes_test_data) //response.data)
            .catch((error: AxiosError) => console.log(error))
    }

    updateWorkflow(id_workflow: number, payload: Workflow): Promise<Workflow> {
        return axiosAuthorized
            .put(`/workflows/${id_workflow}`, payload)
            .then((response) => response.data)
            .catch((error) => console.log(error))
    }

    deleteWorkflow(id_workflow: number): Promise<Workflow> {
        return axiosAuthorized
            .delete(`/workflows/${id_workflow}`)
            .then((response: AxiosResponse) => response.data)
            .catch((error: AxiosError) => console.log(error))
    }

    createClass(id_workflow: number, payload: NewLabel): Promise<NewLabel> {
        let params = buildFilteredUrl(payload)
        return axiosAuthorized
            .post(`/workflows/${id_workflow}/label?${params}`)
            .then((response) => response.data)
            .catch((error) => console.log(error))
    }

    deleteClass(id_workflow: number, name: string): Promise<any> {
        let params = buildFilteredUrl({ name: name })
        return axiosAuthorized
            .delete(`/workflows/${id_workflow}/label?${params}`)
            .then((response) => response.data)
            .catch((error) => console.log(error))
    }
}

export default new WorkflowsService()
