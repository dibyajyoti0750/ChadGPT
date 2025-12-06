import { useState, type ReactElement } from "react";
import Chat from "./Chat";
import Sidebar from "../components/Sidebar";

export default function Layout(): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="border-r border-neutral-900/90 text-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      <main className="flex-1 bg-[#212121] text-white">
        <Chat />
      </main>
    </div>
  );
}
