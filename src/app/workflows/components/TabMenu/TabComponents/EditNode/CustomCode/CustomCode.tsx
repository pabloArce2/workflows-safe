import { useEffect, useRef, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { useWorkflows } from "@/context/WorkflowsContext"
import Editor from "@monaco-editor/react"

import { Icons } from "@/components/Icons"

import { useFormContext } from "../../../../Inputs/InputsForm"
import CodeTemplateSelect from "./CodeTemplateSelect"
import { pythonTemplates } from "./pythonTemplates"

interface CustomCodeProps {
    className?: string
    node: NodeSchema
}

// Import the templates

const CustomCode = ({ className, node }: CustomCodeProps) => {
    const editorRef = useRef(null)
    const [defaultLanguage, setDefaultLanguage] = useState<string>("python")
    const { setValue } = useFormContext()
    const { isEditExpanded, setIsEditExpanded } = useWorkflows()

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor
    }

    function handleEditorChange(value: string | undefined) {
        // Update the input value of the node with the editor's content
        if (value !== undefined) {
            setValue(node.schemaId, value) // Assuming `node.schemaId` is the key to store this code
        }
    }

    function handleSelectTemplate(templateKey: string) {
        if (editorRef.current && pythonTemplates[templateKey]) {
            editorRef.current.setValue(pythonTemplates[templateKey])
            setValue(node.schemaId, pythonTemplates[templateKey])
        }
    }

    useEffect(() => {
        if (editorRef.current) {
            const initialValue = editorRef.current.getValue()
            setValue(node.schemaId, initialValue)
        }
    }, [node.schemaId, setValue])

    return (
        <div className={`h-full overflow-y-auto flex flex-col gap-2 ${className}`}>
            <div className="flex items-center px-2 h-[5vh]">
                <CodeTemplateSelect className="w-40" onSelectTemplate={handleSelectTemplate} />
                <div
                    className="p-2 cursor-pointer ml-auto hover:border-gray-400 rounded-xl border"
                    onClick={() => setIsEditExpanded(!isEditExpanded)}
                >
                    {isEditExpanded ? <Icons.maximaze2 size={20} /> : <Icons.minimize2 size={20} />}
                </div>
            </div>
            <Editor
                className="border border-blue-500 rounded-xl py-2 bg-gray-900"
                height="80vh"
                defaultLanguage={defaultLanguage}
                defaultValue="## Write your code here"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange} // Track changes in the editor
            />
        </div>
    )
}

export default CustomCode
