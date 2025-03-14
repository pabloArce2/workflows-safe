import { useEffect, useRef, useState } from "react"
import { DropDownInput, InputSchemaValue, TextInput } from "@/common/common-types"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/Command/Command"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/Form/Form"
import { Input } from "@/components/ui/Input/Input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover/Popover"
import { Icons } from "@/components/Icons"

import { useFormContext } from "../InputsForm"

interface DetectionInputComponentProps {
    field: any
    inputSchema: TextInput
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DetectionInputComponent: React.FC<DetectionInputComponentProps> = ({
    field,
    inputSchema,
    open,
    onOpenChange,
}) => {
    const { setValue, handleSubmit, setOpenStates } = useFormContext()
    const triggerRef = useRef<HTMLDivElement>(null)

    const onSelectHandler = (optionValue: InputSchemaValue) => {
        setValue(inputSchema.label, optionValue)
        handleSubmit()
        setOpenStates((prev: any) => ({ ...prev, [inputSchema.label]: false }))
    }

    setValue(inputSchema.label, "optionValue")

    return (
        <FormItem>
            <FormLabel>{inputSchema.label}</FormLabel>
            <FormControl>
                <div className="flex items-center gap-2 p-2 border border-gray-600 rounded-lg">
                    <Icons.binary />
                    <p>Detecciones_v01</p>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}

export default DetectionInputComponent
