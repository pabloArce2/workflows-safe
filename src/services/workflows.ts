import { supabase } from "@/lib/supabaseClient"

export interface Workflow {
    id: string
    name: string
    created_at: string
    user_id: string
}

export interface WorkflowData {
    workflow: Workflow
    nodes: any[] // node_data[]
    edges: any[] // edge_data[]
    viewport: any // viewport data
}

async function createWorkflow(name: string, userId: string) {
    const { data, error } = await supabase
        .from("workflows")
        .insert([{ name: name, user_id: userId }])
        .select()
        .single()

    if (error) throw new Error("Error creating workflow")

    const workflowId = data.id

    // Optional: insert empty data so it exists
    await supabase.from("nodes").insert([{ workflow_id: workflowId, node_data: [] }])
    await supabase.from("edges").insert([{ workflow_id: workflowId, edge_data: [] }])
    await supabase.from("viewports").insert([{ workflow_id: workflowId, viewport: { x: 0, y: 0, zoom: 1 } }])

    return data
}

// ✅ Get all workflows for current user
async function getUserWorkflows(userId: string): Promise<Workflow[]> {
    const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) throw new Error("Error fetching workflows")

    return data
}

// ✅ Get full workflow (basic info + nodes + edges + viewport)
async function getWorkflowById(id: string, userId: string): Promise<WorkflowData> {
    const { data: workflow, error: wfError } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single()

    if (wfError || !workflow) throw new Error("Workflow not found")

    const { data: nodes } = await supabase.from("nodes").select("node_data").eq("workflow_id", id)

    const { data: edges } = await supabase.from("edges").select("edge_data").eq("workflow_id", id)

    const { data: viewport } = await supabase.from("viewports").select("viewport").eq("workflow_id", id).single()

    if (!nodes || !edges || !viewport) throw new Error("Error fetching workflow data")

    return {
        workflow: {
            id: workflow.id,
            name: workflow.name,
            created_at: workflow.created_at,
            user_id: workflow.user_id,
        },
        nodes: nodes.map((node) => node.node_data),
        edges: edges.map((edge) => edge.edge_data),
        viewport: viewport.viewport,
    }
}

// ✅ Update workflow name
async function updateWorkflowName(id: string, name: string, userId: string) {
    const { error } = await supabase.from("workflows").update({ name }).eq("id", id).eq("user_id", userId)

    if (error) throw new Error("Failed to update workflow name")
}

// ✅ Save nodes, edges and viewport
async function saveWorkflowData(workflowId: string, nodes: any[], edges: any[], viewport: any) {
    await supabase.from("nodes").delete().eq("workflow_id", workflowId)
    await supabase.from("edges").delete().eq("workflow_id", workflowId)

    if (nodes.length > 0) {
        await supabase.from("nodes").insert(nodes.map((node) => ({ workflow_id: workflowId, node_data: node })))
    }

    if (edges.length > 0) {
        await supabase.from("edges").insert(edges.map((edge) => ({ workflow_id: workflowId, edge_data: edge })))
    }

    // Upsert viewport
    await supabase.from("viewports").upsert({ workflow_id: workflowId, viewport })
}

// ✅ Delete workflow (cascades to nodes/edges/viewports if DB is set up)
async function deleteWorkflow(id: string, userId: string) {
    const { error } = await supabase.from("workflows").delete().eq("id", id).eq("user_id", userId)

    if (error) throw new Error("Failed to delete workflow")
}

const workflowService = {
    createWorkflow,
    getUserWorkflows,
    getWorkflowById,
    updateWorkflowName,
    saveWorkflowData,
    deleteWorkflow,
}

export default workflowService
