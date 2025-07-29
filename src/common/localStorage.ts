// Utilidades para manejar el último workflowId en localStorage

const LAST_WORKFLOW_ID_KEY = "workflowsafe_lastWorkflowId"

export function setLastWorkflowId(workflowId: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem(LAST_WORKFLOW_ID_KEY, workflowId)
    }
}

export function getLastWorkflowId(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem(LAST_WORKFLOW_ID_KEY)
    }
    return null
}

export function clearLastWorkflowId() {
    if (typeof window !== "undefined") {
        localStorage.removeItem(LAST_WORKFLOW_ID_KEY)
    }
}
