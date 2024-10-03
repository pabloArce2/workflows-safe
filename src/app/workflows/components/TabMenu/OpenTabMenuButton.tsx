import { useWorkflows } from "@/context/WorkflowsContext"
import { observer } from "mobx-react-lite"

import { WORKFLOW_GAP } from "@/lib/constants"
import { Icons } from "@/components/Icons"

interface OpenTabMenuButtonProps {
  className?: string
}

const OpenTabMenuButton = ({ className }: OpenTabMenuButtonProps) => {
  const { isOpenNodePanel, setIsOpenNodePanel } = useWorkflows()

  const handleOpen = () => {
    setIsOpenNodePanel(!isOpenNodePanel)
  }

  return (
    <div
      className={`z-20 absolute p-2 border-2 hover:shadow-md hover:cursor-pointer ${className}`}
      style={{
        top: WORKFLOW_GAP,
        right: WORKFLOW_GAP,
        backgroundColor: "rgba(245,245,245,0.88)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleOpen}
    >
      <Icons.alignJustify strokeWidth={2} />
    </div>
  )
}

export default observer(OpenTabMenuButton)
