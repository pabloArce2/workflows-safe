import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
    BackendJsonValueInput,
    DropDownInput,
    Input,
    InputData,
    InputId,
    Output,
    SchemaId,
    TextInput,
} from "@/common/common-types"
import { GlobalContext } from "@/context/GlobalNodeState"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Node } from "reactflow"
import { Schema, z } from "zod"

import { toast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button/Button"
import { Form, FormField } from "@/components/ui/Form/Form"

import CameraInputComponent from "./CameraInputComponent/CameraInputComponent"
import DetectionInputComponent from "./DetectionsInputComponent/DetectionInputComponent"
import DropdownInputComponent from "./DropdownInputComponent/DropdownInputComponent"
import NumberInputComponent from "./NumberInputComponent/NumberInputComponent"
import OperatorsDropdown from "./OperatorInputComponent/OperatorInputComponents"
import TextInputComponent from "./TextInputComponent/TextInputComponent"

interface InputsProps {
    node: Node<any>
    inputsSchema: readonly Input[]
    outputsSchema: readonly Output[]
}

export function InputsForm({ node, inputsSchema, outputsSchema, ...props }: InputsProps) {
    const { updateNodeInputsById, updateNodeOutputsById } = useContext(GlobalContext)

    const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

    const handleOpenChange = (inputId: string, isOpen: boolean) => {
        setOpenStates((prevStates) => ({ ...prevStates, [inputId]: isOpen }))
    }

    const FormSchema = z.object({
        // Mapear los inputSchema y crear claves basadas en sus ID
        ...Object.fromEntries(
            inputsSchema.map((inputSch) => [
                inputSch.id,
                inputSch.kind === "text"
                    ? z.string().min(1, { message: inputSch.label + " is required" }) // Puedes personalizar el mensaje de error aquí
                    : z.string().nullable(),
            ])
        ),
        ...Object.fromEntries(
            outputsSchema.map((outputSch) => [
                outputSch.id,
                outputSch.kind === "value"
                    ? z.string().min(1, { message: outputSch.label + " is required" })
                    : z.string().nullable(),
            ])
        ),
    })

    const calculateDefaultValues = () => {
        const inputDefaults = inputsSchema.reduce((acc, inputSch) => {
            const inputsArray = Array.isArray(node?.data?.inputs) ? node.data.inputs : []
            const input = inputsArray.find((input: { inputId: string }) => input.inputId === inputSch.id)
            acc[inputSch.id] = input?.value ?? ""
            return acc
        }, {} as Record<string, any>)

        const outputDefaults = outputsSchema.reduce((acc, outputSch) => {
            const outputsArray = Array.isArray(node?.data?.outputs) ? node.data.outputs : []
            const output = outputsArray.find((output: { outputId: string }) => output.outputId === outputSch.id)
            acc[outputSch.id] = output?.value ?? ""
            return acc
        }, {} as Record<string, any>)

        return { ...inputDefaults, ...outputDefaults }
    }

    const updateFormValues = () => {
        const newDefaultValues = calculateDefaultValues()
        Object.entries(newDefaultValues).forEach(([key, value]) => {
            form.setValue(key, value)
        })
    }

    useEffect(() => {
        updateFormValues()
    }, [node])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function transformToBackendJsonInputValue(inputData: InputData): BackendJsonValueInput[] {
        return Object.entries(inputData).map(([inputId, value]) => {
            const type = "value" as const
            return { inputId, type, value }
        })
    }

    function transformToBackendJsonOutputValue(outputData: InputData): BackendJsonValueInput[] {
        return Object.entries(outputData).map(([outputId, value]) => {
            let type = "value" as const
            return { outputId, type, value } // Devolver un objeto con las propiedades requeridas
        })
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const inputs = Object.fromEntries(inputsSchema.map((inputSch) => [inputSch.id, data[inputSch.id]]))
        const outputs = Object.fromEntries(outputsSchema.map((outputSch) => [outputSch.id, data[outputSch.id]]))

        const transformedInputs = transformToBackendJsonInputValue(inputs)
        const transformedOutputs = transformToBackendJsonOutputValue(outputs)

        updateNodeInputsById(node.id, transformedInputs)
        updateNodeOutputsById(node.id, transformedOutputs)

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    const handleSubmit = (onSubmit: any) => form.handleSubmit(onSubmit)

    const formContextValue = {
        setValue: form.setValue,
        handleSubmit: handleSubmit,
        setOpenStates: setOpenStates,
    }

    return (
        <FormContext.Provider value={formContextValue}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-stretch gap-3">
                    <h3 className="text-sm font-medium">Inputs</h3>
                    {inputsSchema.map((inputSch) => (
                        <FormField
                            key={inputSch.id}
                            control={form.control}
                            name={inputSch.id}
                            render={({ field }) => {
                                const isOpen = openStates[inputSch.label] || false
                                switch (inputSch.kind) {
                                    case "dropdown":
                                        return (
                                            <DropdownInputComponent
                                                field={field}
                                                inputSchema={inputSch}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch?.label, open)}
                                            />
                                        )
                                    case "text":
                                        return (
                                            <TextInputComponent
                                                field={field}
                                                inputSchema={inputSch}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch.label, open)}
                                            />
                                        )
                                    case "number":
                                        return (
                                            <NumberInputComponent
                                                field={field}
                                                inputSchema={inputSch}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch.label, open)}
                                            />
                                        )
                                    case "operator":
                                        return (
                                            <OperatorsDropdown
                                                field={field}
                                                label={inputSch.label}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch.label, open)}
                                            />
                                        )
                                    case "detections":
                                        return (
                                            <DetectionInputComponent
                                                field={field}
                                                inputSchema={inputSch}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch.label, open)}
                                            />
                                        )
                                    case "camera":
                                        return (
                                            <CameraInputComponent
                                                field={field}
                                                inputSchema={inputSch}
                                                open={isOpen}
                                                onOpenChange={(open) => handleOpenChange(inputSch.label, open)}
                                            />
                                        )
                                    // other cases...
                                    default:
                                        return <div></div>
                                }
                            }}
                        />
                    ))}

                    {outputsSchema.length > 0 && (
                        <>
                            <h3 className="text-sm font-medium">Outputs</h3>
                            {outputsSchema.map((outputSch) => (
                                <FormField
                                    key={outputSch.id}
                                    control={form.control}
                                    name={outputSch.id}
                                    render={({ field }) => {
                                        const isOpen = openStates[outputSch.label] || false
                                        switch (outputSch.kind) {
                                            case "dropdown":
                                                return (
                                                    <DropdownInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )
                                            case "text":
                                                return (
                                                    <TextInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )
                                            case "value":
                                                return (
                                                    <TextInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )
                                            case "detection":
                                                return (
                                                    <TextInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )

                                            case "bool":
                                                return (
                                                    <TextInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )
                                            case "camera":
                                                return (
                                                    <TextInputComponent
                                                        field={field}
                                                        inputSchema={outputSch}
                                                        open={isOpen}
                                                        onOpenChange={(open) =>
                                                            handleOpenChange(outputSch.label, open)
                                                        }
                                                    />
                                                )

                                            // other cases...
                                            default:
                                                return <div></div>
                                        }
                                    }}
                                />
                            ))}
                        </>
                    )}
                    <Button>Save</Button>
                </form>
            </Form>
        </FormContext.Provider>
    )
}

interface FormContextProps {
    setValue: Function
    handleSubmit: Function
    setOpenStates: Function
}

const FormContext = createContext<FormContextProps>({
    setValue: () => {},
    handleSubmit: () => {},
    setOpenStates: () => {},
})

export const useFormContext = () => useContext(FormContext)
