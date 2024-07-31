import { createElement } from "react"
import { Category, NodeSchema } from "@/common/common-types"
import { groupBy } from "@/common/util"

import { cn } from "@/lib/utils"
import { CommandItem } from "@/components/ui/Command/Command"
import { Icons } from "@/components/Icons"

interface SubcategoriesProps {
    category: Category
    categoryNodes: readonly NodeSchema[]
    value: any
    setOpen: any
    setValue: any
}

export const SubcategoriesCommandItem = ({
    category,
    categoryNodes,
    value,
    setOpen,
    setValue,
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
                        className=""
                        onSelect={() => {
                            setValue(schema.name === value ? "" : schema.name)
                            setOpen(false)
                        }}
                    >
                        <div className="flex gap-2 items-center ">
                            {schema?.icon &&
                                createElement(schema.icon, {
                                    style: { color: schema?.color },
                                    className: "w-3.5",
                                })}
                            <p className="">{schema?.name}</p>
                        </div>
                        <Icons.check
                            className={cn(
                                "ml-auto mr-2 h-4 w-4",
                                value === schema?.name ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </CommandItem>
                ))
            })}
        </>
    )
}
