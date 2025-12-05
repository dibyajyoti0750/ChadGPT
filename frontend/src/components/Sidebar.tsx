import type { ReactElement } from "react";
import { Edit, PanelRight } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps): ReactElement {
  const buttonStyles: string =
    "flex justify-center items-center h-12 w-12 hover:bg-neutral-800 rounded-lg cursor-pointer";

  return (
    <>
      {sidebarOpen ? (
        <div className="w-[260px] flex flex-col justify-center p-5">
          <div className="flex justify-between items-center">
            <div className="font-medium">ChadGPT</div>
            <div
              title="Close sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={buttonStyles}
            >
              <PanelRight size={22} />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-20 flex flex-col justify-center items-center gap-3 p-5">
          <div
            title="Open sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`group relative ${buttonStyles}`}
          >
            <div className="text-center transition-opacity duration-150 group-hover:opacity-0">
              😎
            </div>
            <PanelRight
              className="absolute inset-0 m-auto opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              size={22}
            />
          </div>

          <div title="New chat" className={buttonStyles}>
            <Edit size={22} />
          </div>
        </div>
      )}
    </>
  );
}
