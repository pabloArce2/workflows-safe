import { SetStateAction, useContext, useMemo, useState } from "react"
import { BackendJsonNode } from "@/common/common-types"
import { toBackendJson } from "@/common/nodes/toBackendJson"
import { groupBy } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { Search } from "lucide-react"
import { useReactFlow } from "reactflow"

import { Button } from "@/components/ui/Button/Button"
import { Separator } from "@/components/ui/Separator/Separator"
import { Icons } from "@/components/Icons"

import { Subcategories } from "./Subcategories"

const CreateNode = () => {
    const { schemata, categories } = useContext(BackendContext)

    const byCategories = useMemo(() => groupBy(schemata.schemata, "category"), [schemata.schemata])

    const { getNodes, getEdges } = useReactFlow()

    const [searchedNode, setSearchedNode] = useState("")

    const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
        setSearchedNode(e.target.value)
    }

    const filteredCategories = useMemo(() => {
        if (!searchedNode) return categories.categories

        const lowercasedSearchTerm = searchedNode.toLowerCase()

        return categories.categories
            .map((category) => ({
                ...category,
                nodes: byCategories
                    .get(category.id)
                    ?.filter((node) => node.name.toLowerCase().includes(lowercasedSearchTerm)),
            }))
            .filter((category) => category.nodes && category.nodes.length > 0)
    }, [searchedNode, categories.categories, byCategories])

    function downloadJson(jsonData: BackendJsonNode[], filename: string) {
        const jsonString = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename || "data.json"
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="h-full flex flex-col  overflow-y-auto">
            <div className="flex flex-col px-10 py-4 gap-2 ">
                <h2 className="font-bold">Add Nodes</h2>
                <p className="text-sm font-light text-gray-500">
                    You can double click or drag to create new node.
                </p>
                <div className="relative flex items-center border-b">
                    <Search className="absolute mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        placeholder="Search for nodes..."
                        value={searchedNode}
                        onKeyDown={(e) => e.stopPropagation()}
                        onChange={handleInputChange}
                        className="flex ml-6 mr-2 h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    />
                    <div className="p-0.5 rounded-full hover:bg-gray-200" onClick={() => setSearchedNode("")}>
                        <Icons.close className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="min-h-[50px] h-full w-full rounded-md mb-2 px-10 overflow-auto space-y-2">
                {/*Se puede cambiar por un ScrollArea en vez de div, pero a mi no me convencía mucho */}
                {filteredCategories.map((category) => {
                    const categoryNodes = byCategories.get(category.id)
                    return (
                        <div key={category.id} className="py-1">
                            <p className="text-sm font-medium">{category.name}</p>
                            {categoryNodes && (
                                <Subcategories
                                    searchedNode={searchedNode}
                                    category={category}
                                    categoryNodes={categoryNodes}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
            <Separator className="" />

            <Button
                type="button"
                className="mt-auto mb-2 mx-10 my-4"
                onClick={() => downloadJson(toBackendJson(getNodes(), getEdges(), schemata), "test.json")}
            >
                Export Json
            </Button>
        </div>
    )
}

export default CreateNode
