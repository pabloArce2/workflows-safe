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

interface DropdownInputComponentProps {
  field: any
  inputSchema: TextInput
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TextInputComponent: React.FC<DropdownInputComponentProps> = ({ field, inputSchema, open, onOpenChange }) => {
  const { setValue, handleSubmit, setOpenStates } = useFormContext()
  const triggerRef = useRef<HTMLDivElement>(null)

  const onSelectHandler = (optionValue: InputSchemaValue) => {
    setValue(inputSchema.label, optionValue)
    handleSubmit()
    setOpenStates((prev: any) => ({ ...prev, [inputSchema.label]: false }))
  }

  return (
    <FormItem>
      <FormLabel>{inputSchema.label}</FormLabel>
      <FormControl>
        <Input placeholder="Ex: example" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TextInputComponent
