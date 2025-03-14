import { Fragment, createElement, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Category, NodeSchema, SchemaId } from "@/common/common-types"
import { groupBy } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext } from "@/context/GlobalNodeState"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover } from "@radix-ui/react-popover"
import { useForm } from "react-hook-form"
import { Node } from "reactflow"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/Command/Command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form/Form"
import { PopoverContent, PopoverTrigger } from "@/components/ui/Popover/Popover"
import { Icons } from "@/components/Icons"

interface SelectNodeProps {
    node: Node<any>
    className: string
}

export function SelectNodeType({ node, className }: SelectNodeProps) {
    const { schemata, categories } = useContext(BackendContext)

    const { updateNodeSchemaId, updateNodeInputsById, updateNodeOutputsById } = useContext(GlobalContext)

    const triggerRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)

    const byCategories = useMemo(() => groupBy(schemata.schemata, "category"), [schemata.schemata])
    const nodes = categories.categories
        .map((category) => {
            return byCategories.get(category.id)
        })
        .flat()

    const FormSchema = z.object({
        schemaId: z.string({
            required_error: "Please select a node type.",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const updateCurrentNodeSchemaId = (node: Node<any>, schemaId: SchemaId) => {
        node.data.schemaId = schemaId
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        updateNodeSchemaId(node.id, data.schemaId as SchemaId)
        updateCurrentNodeSchemaId(node, data.schemaId as SchemaId)
        updateNodeInputsById(node.id, {})
        updateNodeOutputsById(node.id, {})

        /* toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        }) */
    }

    useEffect(() => {
        form.setValue("schemaId", node.data.schemaId)
    }, [node])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2 w-full">
                <FormField
                    control={form.control}
                    name="schemaId"
                    defaultValue={node.data.schemaId}
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Node Type</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl ref={triggerRef}>
                                            <Button
                                                variant="ghost"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={cn(className, "justify-between border-border border")}
                                            >
                                                {field.value
                                                    ? nodes.find((node) => node?.schemaId === field.value)?.name
                                                    : "Select node..."}
                                                <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        style={{ width: `${triggerRef.current?.getBoundingClientRect().width}px` }}
                                        className={cn(className, "p-0 m-0")}
                                    >
                                        <Command>
                                            <CommandInput placeholder="Search node type..." />
                                            <CommandEmpty>No nodes found.</CommandEmpty>
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                {categories.categories.map((category) => {
                                                    const categoryNodes = byCategories.get(category.id)
                                                    return (
                                                        <Fragment key={category.id}>
                                                            <CommandGroup heading={category.name}>
                                                                {categoryNodes && (
                                                                    <SubcategoriesCommandItem
                                                                        setOpen={setOpen}
                                                                        form={form}
                                                                        field={field}
                                                                        category={category}
                                                                        categoryNodes={categoryNodes}
                                                                        onSubmit={onSubmit}
                                                                    />
                                                                )}
                                                            </CommandGroup>
                                                            <CommandSeparator />
                                                        </Fragment>
                                                    )
                                                })}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription className="">
                                    This is the type that will be asign to this node.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
            </form>
        </Form>
    )
}

interface SubcategoriesProps {
    category: Category
    categoryNodes: readonly NodeSchema[]
    form: any
    setOpen: any
    field: any
    onSubmit: any
}

export const SubcategoriesCommandItem = ({
    category,
    categoryNodes,
    form,
    setOpen,
    field,
    onSubmit,
}: SubcategoriesProps) => {
    const byGroup = groupBy(categoryNodes, "nodeGroup")
    return (
        <>
            {category.groups.map((group) => {
                const schemas = byGroup.get(group.id)
                if (!schemas) return null

                return schemas.map((schema, index) => (
                    <CommandItem
                        key={`${group.id}-${schema.schemaId}`}
                        value={schema.name.toLowerCase()}
                        onSelect={() => {
                            form.setValue("schemaId", schema.schemaId)
                            form.handleSubmit(onSubmit)()
                            setOpen(false)
                        }}
                    >
                        <Icons.check
                            className={cn(
                                "mr-2 h-4 w-4",
                                field.value === schema.name ? "opacity-100" : "opacity-0"
                            )}
                        />
                        <div className="flex gap-2 items-center ">
                            {schema?.icon &&
                                createElement(schema.icon, {
                                    style: { color: schema?.color },
                                    className: "w-3.5",
                                })}
                            <p className="">{schema?.name}</p>
                        </div>
                    </CommandItem>
                ))
            })}
        </>
    )
}
