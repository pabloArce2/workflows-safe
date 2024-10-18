import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select/Select"

interface CodeTemplateSelectProps {
    className?: string
    onSelectTemplate: (template: string) => void
}

export const CodeTemplateSelect: React.FC<CodeTemplateSelectProps> = ({ onSelectTemplate, className }) => {
    return (
        <Select onValueChange={onSelectTemplate}>
            <SelectTrigger className={`${className}`}>
                <SelectValue placeholder="Select a code template" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Python Code Templates</SelectLabel>
                    <SelectItem value="basic-function">Basic Function</SelectItem>
                    <SelectItem value="http-request">HTTP Request</SelectItem>
                    <SelectItem value="data-analysis">Data Analysis</SelectItem>
                    <SelectItem value="sql-query">SQL Query</SelectItem>
                    <SelectItem value="error-handling">Error Handling</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default CodeTemplateSelect
