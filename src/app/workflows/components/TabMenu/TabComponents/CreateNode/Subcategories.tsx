import { memo } from "react"
import { Category, NodeSchema } from "@/common/common-types"
import { groupBy } from "@/common/util"

import NodeColumn from "./NodeColumn"

interface SubcategoriesProps {
    searchedNode: string
    category: Category
    categoryNodes: readonly NodeSchema[]
}

export const Subcategories = memo(({ searchedNode, category, categoryNodes }: SubcategoriesProps) => {
    const byGroup = groupBy(categoryNodes, "nodeGroup")
    const lowercasedSearchTerm = searchedNode.toLowerCase()

    return (
        <div className="space-y-3">
            {category.groups.map((group) => {
                const nodes = byGroup
                    .get(group.id)
                    ?.filter((node) => node.name.toLowerCase().includes(lowercasedSearchTerm))
                if (!nodes || nodes.length === 0) return null

                return (
                    <div key={group.id} className="space-y-2 flex flex-col">
                        <h3 className="text-muted-foreground text-sm">{group.name}</h3>
                        <div className="flex flex-col gap-2">
                            {nodes.map((node) => (
                                <NodeColumn key={node.schemaId} node={node} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
