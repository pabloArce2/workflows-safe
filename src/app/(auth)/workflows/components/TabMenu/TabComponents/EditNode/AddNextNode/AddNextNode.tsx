import { Icons } from "@/components/Icons"

import AddNextNodeCommand from "./Command/AddNextNodeCommand"

const AddNextNode = () => {
    return (
        <div className="flex flex-col w-full gap-4 px-10 py-4">
            <div className="flex gap-4 items-center">
                <div className="bg-neutral-300 h-fit w-fit p-2 rounded-lg">
                    <Icons.waypoints />
                </div>
                <div className="flex flex-col text-sm">
                    <p>Go to</p>
                    <p className="font-light text-gray-500">Add next node to connect</p>
                </div>
            </div>
            <AddNextNodeCommand />
        </div>
    )
}

export default AddNextNode
