import { useEffect, useState, type MouseEvent, type ReactElement } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Ellipsis,
  PanelRight,
  Trash2,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads } from "../features/chats/chatSlice";
import type { AppDispatch, RootState } from "../app/store";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(true);

  const { user } = useUser();
  const dispatch: AppDispatch = useDispatch();
  const history = useSelector((state: RootState) => state.chat.history);

  const { getToken } = useAuth();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    threadId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedThreadId(threadId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteThread = async (threadId: string) => {
    try {
      const token = await getToken();
      const { data } = await api.delete(`/api/chat/thread/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchThreads(token));
        handleClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    }
  };

  const buttonStyles: string =
    "flex justify-center items-center h-12 w-12 hover:bg-[#383838] rounded-lg cursor-pointer";

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchThreads(token));
    });
  }, [dispatch, getToken]);

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

          <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto no-scrollbar">
            <div
              onClick={() => setShowHistory(!showHistory)}
              className="group flex items-center gap-1 text-neutral-400 cursor-pointer"
            >
              Your chats
              {showHistory ? (
                <ChevronDown
                  className="opacity-0 group-hover:opacity-100"
                  size={15}
                />
              ) : (
                <ChevronRight
                  className="opacity-0 group-hover:opacity-100"
                  size={15}
                />
              )}
            </div>

            {showHistory && (
              <ul className="mt-1 space-y-1">
                {history.map((thread) => (
                  <li
                    key={thread.threadId}
                    className="px-3 py-2 -ml-3 hover:bg-[#383838] rounded-xl cursor-pointer group"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="truncate">{thread.title}</div>

                      <button onClick={(e) => handleClick(e, thread.threadId)}>
                        <Ellipsis
                          className="hidden group-hover:block cursor-pointer"
                          size={18}
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="h-18 w-full flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-800">
            <UserButton />
            <div className="flex flex-col justify-center">
              <span className="font-medium">{user?.fullName}</span>
              <span className="text-sm text-neutral-400">Free</span>
            </div>
          </div>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="flex flex-col p-1.5">
              <div
                onClick={() =>
                  selectedThreadId && deleteThread(selectedThreadId)
                }
                className="flex items-center gap-1 text-red-600 hover:bg-red-200 rounded text-sm font-medium p-1.5 cursor-pointer"
              >
                <Trash2 size={15} />
                Delete
              </div>
            </div>
          </Popover>
        </div>
      ) : (
        <div
          onClick={() => setSidebarOpen(true)}
          className="w-18 h-full flex flex-col justify-between items-center p-2 bg-[#212121] cursor-ew-resize"
        >
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
