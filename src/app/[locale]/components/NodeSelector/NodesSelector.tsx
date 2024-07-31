import { memo, useContext, useMemo, useState } from "react"
import { BackendJsonNode, Category, NodeSchema } from "@/common/common-types"
import { toBackendJson } from "@/common/nodes/toBackendJson"
import { groupBy } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { useReactFlow } from "reactflow"

import { WORKFLOW_GAP } from "@/lib/constants"
import useWindowHeight from "@/hooks/useWindowHeight"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion/Accordion"
import { Button } from "@/components/ui/Button/Button"

import RegularNodeItem from "./RegularNodeItem/RegularNodeItem"

type Props = {}

const EMPTY_STRING = ""

const NodeSelector = (props: Props) => {
    const windowHeight = useWindowHeight()
    const [openItem, setOpenItem] = useState<string>(EMPTY_STRING)
    const { schemata, categories } = useContext(BackendContext)

    const byCategories = useMemo(() => groupBy(schemata.schemata, "category"), [schemata.schemata])

    const handleMouseEnter = (itemValue: string) => {
        setOpenItem(itemValue)
    }

    const handleMouseLeave = () => {
        setOpenItem(EMPTY_STRING)
    }

    const { getNodes, getEdges } = useReactFlow()

    function downloadJson(jsonData: BackendJsonNode[], filename: string) {
        // Convert JSON object to a JSON string
        const jsonString = JSON.stringify(jsonData, null, 2)

        // Create a Blob with the JSON string
        const blob = new Blob([jsonString], { type: "application/json" })

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob)

        // Create a link element
        const link = document.createElement("a")

        // Set the href and download attributes
        link.href = url
        link.download = filename || "data.json"

        // Simulate a click on the link to trigger the download
        link.click()

        // Clean up by revoking the URL
        URL.revokeObjectURL(url)
    }

    return (
        <section
            className="z-20 absolute w-56 px-2 rounded-md border flex flex-col"
            style={{
                top: WORKFLOW_GAP,
                left: WORKFLOW_GAP,
                height: windowHeight - WORKFLOW_GAP * 2,
                backgroundColor: "rgba(245,245,245,0.88)",
                backdropFilter: "blur(4px)",
            }}
        >
            <Accordion type="single" value={openItem} onValueChange={setOpenItem} collapsible>
                {categories.categories.map((category) => {
                    const categoryNodes = byCategories.get(category.id)
                    return (
                        <AccordionItem
                            value={category.id}
                            key={category.id}
                            onMouseEnter={() => handleMouseEnter(category.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <AccordionTrigger>{category.name}</AccordionTrigger>
                            <AccordionContent>
                                {categoryNodes && (
                                    <Subcategories category={category} categoryNodes={categoryNodes} />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
            <Button
                type="button"
                className="mt-auto mb-2 mx-2"
                onClick={() => downloadJson(toBackendJson(getNodes(), getEdges(), schemata), "test.json")}
            >
                Export Json
            </Button>
        </section>
    )
}

export default NodeSelector

interface SubcategoriesProps {
    category: Category
    categoryNodes: readonly NodeSchema[]
}

export const Subcategories = memo(({ category, categoryNodes }: SubcategoriesProps) => {
    const byGroup = groupBy(categoryNodes, "nodeGroup")
    return (
        <div className="space-y-3">
            {category.groups.map((group) => {
                const nodes = byGroup.get(group.id)
                if (!nodes) return null

                return (
                    <div key={group.id} className="space-y-2 flex flex-col">
                        <h3 className="font-semibold text-muted-foreground pl-3">{group.name}</h3>
                        <div>
                            {nodes.map((node) => (
                                <RegularNodeItem key={node.schemaId} node={node} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
