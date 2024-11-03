import { useContext, useRef, useState } from "react"
import { BackendJsonValueInput, NodeSchema } from "@/common/common-types"
import { GlobalContext } from "@/context/GlobalNodeState"
import { useWorkflows } from "@/context/WorkflowsContext"
import Editor from "@monaco-editor/react"

import { Icons } from "@/components/Icons"

import CodeTemplateSelect from "./CodeTemplateSelect"
import { pythonTemplates } from "./pythonTemplates"

interface CustomCodeProps {
    className?: string
    node: NodeSchema
    nodeId: string
}

const CustomCode = ({ className, node, nodeId }: CustomCodeProps) => {
    const editorRef = useRef(null)
    const [defaultLanguage, setDefaultLanguage] = useState<string>("python")
    const { isTabMenuMax, setIsTabMenuMax } = useWorkflows()
    const { updateNodeInputsById } = useContext(GlobalContext)

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor
        const initialCode = node.inputs?.code?.value || "## Write your code here"
        editor.setValue(initialCode)
    }

    function handleEditorChange(value: string | undefined) {
        if (value !== undefined) {
            const updatedInput: BackendJsonValueInput = {
                inputId: "code",
                type: "value",
                value,
            }
            updateNodeInputsById(nodeId, [updatedInput]) // Actualiza solo el input "code"
        }
    }

    function handleSelectTemplate(templateKey: string) {
        if (editorRef.current && pythonTemplates[templateKey as keyof typeof pythonTemplates]) {
            const templateCode = pythonTemplates[templateKey as keyof typeof pythonTemplates]
            editorRef.current.setValue(templateCode)
            handleEditorChange(templateCode) // Actualizar directamente después de seleccionar plantilla
        }
    }

    return (
        <div className={`h-full overflow-y-auto flex flex-col gap-2 ${className}`}>
            <div className="flex items-center px-2 h-[5vh]">
                <CodeTemplateSelect className="w-40" onSelectTemplate={handleSelectTemplate} />
                <div
                    className="p-2 cursor-pointer ml-auto hover:border-gray-400 rounded-xl border"
                    onClick={() => setIsTabMenuMax(!isTabMenuMax)}
                >
                    {isTabMenuMax ? <Icons.minimize2 size={20} /> : <Icons.maximaze2 size={20} />}
                </div>
            </div>
            <Editor
                className="border border-blue-500 rounded-xl py-4 bg-gray-900"
                height="80vh"
                defaultLanguage={defaultLanguage}
                defaultValue="## Write your code here"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    )
}

export default CustomCode
