import { useWorkflows } from "@/context/WorkflowsContext"
import { observer } from "mobx-react-lite"

import { WORKFLOW_GAP } from "@/lib/constants"
import useWindowHeight from "@/hooks/useWindowHeight"
import { Separator } from "@/components/ui/Separator/Separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs/Tabs"
import { Icons } from "@/components/Icons"

import CreateNode from "./TabComponents/CreateNode/CreateNode"
import EditNode from "./TabComponents/EditNode/EditNode"

interface TabMenuProps {
    className?: string
}

const TabMenu = ({ className }: TabMenuProps) => {
    const windowHeight = useWindowHeight()
    const { selectedTabNodePanel, setSelectedTabNodePanel, isOpenNodePanel, setIsOpenNodePanel, isEditExpanded } =
        useWorkflows()

    return (
        <section
            className={`${
                isEditExpanded ? "w-[100vh]" : "w-96"
            } z-20 absolute w-96 rounded-md border select-none bg-background duration-300`}
            style={{
                top: WORKFLOW_GAP,
                right: WORKFLOW_GAP,
                height: windowHeight - WORKFLOW_GAP * 2,
                backdropFilter: "blur(4px)",
            }}
        >
            <div className="py-2 px-3">
                <div
                    className="w-fit p-0.5 hover:bg-gray-200 rounded-full ml-auto"
                    onClick={() => setIsOpenNodePanel(!isOpenNodePanel)}
                >
                    <Icons.close className="cursor-pointer w-5 " />
                </div>
            </div>

            <Tabs
                value={selectedTabNodePanel}
                onValueChange={setSelectedTabNodePanel}
                style={{
                    height: windowHeight - WORKFLOW_GAP * 8,
                }}
            >
                <TabsList className="relative flex items-center justify-center bg-transparent gap-10 pb-10">
                    <TabsTrigger className="data-[state=active]:shadow-none rounded-none" value="create">
                        Crear nodo
                    </TabsTrigger>
                    <TabsTrigger className="data-[state=active]:shadow-none rounded-none" value="edit">
                        Editar nodo
                    </TabsTrigger>
                    <div
                        className={`absolute duration-300 w-9 pt-0.5 bg-black rounded-xl top-6 ${
                            selectedTabNodePanel === "create" ? "-translate-x-[4.2rem]" : "translate-x-[4.4rem]"
                        }`}
                    ></div>
                </TabsList>
                <Separator className="" />
                <TabsContent value="create" className="w-full h-full">
                    <CreateNode />
                </TabsContent>
                <TabsContent value="edit" className="w-full h-full">
                    <EditNode />
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default observer(TabMenu)
