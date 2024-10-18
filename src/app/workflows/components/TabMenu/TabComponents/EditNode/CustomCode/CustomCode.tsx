import { useEffect, useRef, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import Editor from "@monaco-editor/react"

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
    const { setValue } = useFormContext() // Use context for managing form state

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
            <div className="flex items-center">
                <CodeTemplateSelect onSelectTemplate={handleSelectTemplate} />
            </div>
            <Editor
                className="border border-blue-500 rounded-xl py-2 bg-gray-900"
                height="82vh"
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
