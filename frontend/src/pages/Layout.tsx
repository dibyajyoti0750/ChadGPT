import { useState, type ReactElement } from "react";
import Chat from "./Chat";
import Sidebar from "../components/Sidebar";

export default function Layout(): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="border-r border-neutral-800 text-white bg-neutral-900">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[#1e1e1e]">
        <Chat />
      </main>
    </div>
  );
}
