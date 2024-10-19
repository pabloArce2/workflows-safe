import { useEffect, useRef, useState } from "react"
import { useWorkflows } from "@/context/WorkflowsContext"
import { observer } from "mobx-react-lite"
import { Resizable } from "re-resizable"

import { MIN_TAB_MENU_WIDTH, WORKFLOW_GAP } from "@/lib/constants"
import useWindowWidth from "@/hooks/use-windowWidth"
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
    const resizableRef = useRef(null)

    const windowHeight = useWindowHeight()
    const windowWidth = useWindowWidth()

    const [tabMenuWidth, setTabMenuWidth] = useState<number>()
    const {
        selectedTabNodePanel,
        setSelectedTabNodePanel,
        isOpenNodePanel,
        setIsOpenNodePanel,
        isTabMenuMax,
        setIsTabMenuMax,
    } = useWorkflows()

    const handleResize = () => {
        const currentWidth = resizableRef?.current?.size?.width || 0
        if (currentWidth >= windowWidth - WORKFLOW_GAP * 2) {
            setIsTabMenuMax(true)
        } else if (currentWidth <= MIN_TAB_MENU_WIDTH) {
            setIsTabMenuMax(false)
        }
    }

    useEffect(() => {
        if (isTabMenuMax) {
            setTabMenuWidth(windowWidth - WORKFLOW_GAP * 2)
        } else {
            setTabMenuWidth(MIN_TAB_MENU_WIDTH)
        }
    }, [isTabMenuMax])

    return (
        <section
            className={`z-20 absolute rounded-md border select-none bg-background duration-300`}
            style={{
                top: WORKFLOW_GAP,
                right: WORKFLOW_GAP,
                backdropFilter: "blur(4px)",
            }}
        >
            <Resizable
                size={{
                    height: windowHeight - WORKFLOW_GAP * 2,
                    width: tabMenuWidth,
                }}
                enable={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: true,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                minWidth={MIN_TAB_MENU_WIDTH}
                maxWidth={windowWidth - WORKFLOW_GAP * 2}
                ref={resizableRef}
                onResize={handleResize}
                onResizeStop={(_event, _direction, refToElement) => {
                    const newWidth = refToElement.offsetWidth
                    setTabMenuWidth(newWidth)
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
                                selectedTabNodePanel === "create"
                                    ? "-translate-x-[4.2rem]"
                                    : "translate-x-[4.4rem]"
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
            </Resizable>
        </section>
    )
}

export default observer(TabMenu)
