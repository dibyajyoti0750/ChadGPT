import { useEffect, useState, type ReactElement } from "react";
import { ChevronDown, Edit, PanelRight } from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface Message {
  _id: string;
  role: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Thread {
  _id: string;
  threadId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps): ReactElement {
  const [history, setHistory] = useState<Thread[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const buttonStyles: string =
    "flex justify-center items-center h-12 w-12 hover:bg-[#383838] rounded-lg cursor-pointer";

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/chat/threads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(data.threads);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        toast.error(msg);
      }
    };

    loadHistory();
  }, []);

  return (
    <>
      {sidebarOpen ? (
        <div className="w-[260px] h-full flex flex-col justify-between p-2 bg-neutral-900">
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2 font-medium text-xl">
              <img
                src={assets.logo}
                alt="logo"
                className="h-10 w-10 object-cover"
              />
              ChadGPT
            </div>
            <div
              title="Close sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={buttonStyles}
            >
              <PanelRight size={20} />
            </div>
          </div>

          <div className="flex flex-col my-3">
            <div className="flex items-center gap-3 p-3 hover:bg-[#383838] rounded-xl cursor-pointer">
              <Edit size={20} />
              New chat
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 p-3">
            <div className="group flex items-center gap-1 text-neutral-400">
              Your chats
              <ChevronDown
                className="opacity-0 group-hover:opacity-100"
                size={15}
              />
            </div>

            <ul className="mt-1 space-y-1">
              {history.map((thread, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 -ml-3 hover:bg-[#383838] rounded-xl cursor-pointer truncate"
                >
                  {thread.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="h-18 w-full flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-800">
            <UserButton />
            <div className="flex flex-col justify-center">
              <span className="font-medium">{user?.fullName}</span>
              <span className="text-sm text-neutral-400">Free</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-18 h-full flex flex-col justify-between items-center p-2 bg-[#212121]">
          <div className="flex flex-col gap-6 p-3">
            <div
              title="Open sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`group relative ${buttonStyles}`}
            >
              <div className="flex justify-center items-center transition-opacity duration-150 group-hover:opacity-0">
                <img
                  src={assets.logo}
                  alt="logo"
                  className="h-10 w-10 object-cover"
                />
              </div>
              <PanelRight
                className="absolute inset-0 m-auto opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                size={20}
              />
            </div>

            <div title="New chat" className={buttonStyles}>
              <Edit size={20} />
            </div>
          </div>

          <div className={buttonStyles}>
            <UserButton />
          </div>
        </div>
      )}
    </>
  );
}
