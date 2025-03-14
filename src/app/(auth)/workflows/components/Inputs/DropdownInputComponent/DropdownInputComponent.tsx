import { useEffect, useRef, useState } from "react"
import { DropDownInput, InputSchemaValue } from "@/common/common-types"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/Command/Command"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/Form/Form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover/Popover"
import { Icons } from "@/components/Icons"

import { useFormContext } from "../InputsForm"

interface DropdownInputComponentProps {
    field: any
    inputSchema: DropDownInput
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DropdownInputComponent: React.FC<DropdownInputComponentProps> = ({
    field,
    inputSchema,
    open,
    onOpenChange,
}) => {
    const { setValue, setOpenStates, handleSubmit } = useFormContext()
    const triggerRef = useRef<HTMLDivElement>(null)

    const onSelectHandler = (optionValue: InputSchemaValue) => {
        setValue(inputSchema.id, optionValue)
        handleSubmit()
        setOpenStates((prev: any) => ({ ...prev, [inputSchema.id]: false }))
    }

    return (
        <FormItem className="flex flex-col w-full space-y-1.5">
            <FormLabel className="capitalize">{inputSchema.label}</FormLabel>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <FormControl ref={triggerRef}>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className={"justify-between border-border border"}
                        >
                            {field.value
                                ? inputSchema.options.find((option) => option?.value === field.value)?.option
                                : `Select ${inputSchema.label}...`}
                            <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent
                    style={{ width: `${triggerRef.current?.getBoundingClientRect().width}px` }}
                    className="p-0 m-0"
                >
                    <Command className="w">
                        <CommandInput placeholder={`Search ${inputSchema.label}...`} />
                        <CommandEmpty>{`No ${inputSchema.label} found.`}</CommandEmpty>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {inputSchema.groups.length === 0 &&
                                inputSchema.options.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value.toString()}
                                            onSelect={() => onSelectHandler(option.value)}
                                        >
                                            <Icons.check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    field.value === option.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.option}
                                        </CommandItem>
                                    )
                                })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )
}

export default DropdownInputComponent
