import { useEffect, useRef } from "react"
import { InputSchemaValue } from "@/common/common-types"
import { OperatorOptions } from "@/mocks/resources/operators"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/Command/Command"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/Form/Form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover/Popover"
import { Icons } from "@/components/Icons"

import { useFormContext } from "../InputsForm"

interface OperatorsDropdownProps {
    field: any
    label: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

const OperatorsDropdown: React.FC<OperatorsDropdownProps> = ({ field, label, open, onOpenChange }) => {
    const { setValue, handleSubmit, setOpenStates } = useFormContext()
    const triggerRef = useRef<HTMLDivElement>(null)

    const onSelectHandler = (optionValue: InputSchemaValue) => {
        // Update the form value for the field
        setValue(field.name, optionValue) // Make sure field.name is used here
        handleSubmit() // Optional: If you want to submit or update other values when an option is selected
        setOpenStates((prev: any) => ({ ...prev, [label]: false })) // Close the dropdown after selection
    }

    return (
        <FormItem className="flex flex-col w-full space-y-1.5">
            <FormLabel className="capitalize">{label}</FormLabel>
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
                                ? OperatorOptions.find((option) => option.value === field.value)?.option
                                : `Select ${label}...`}
                            <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent
                    style={{ width: `${triggerRef.current?.getBoundingClientRect().width}px` }}
                    className="p-0 m-0"
                >
                    <Command>
                        <CommandList>
                            {OperatorOptions.map((option) => (
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
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )
}

export default OperatorsDropdown
