import { ArrowUp } from "lucide-react";
import { useState, type ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export default function Chat(): ReactElement {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [threadId, setThreadId] = useState<string>(uuidv4());

  const { getToken } = useAuth();

  const getResponse = async () => {
    try {
      const { data } = await api.post(
        "/api/chat/message",
        { threadId, query },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setResponse(data.reply);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
          What's on your mind today?
        </h1>

        <div className="w-full flex items-center gap-3 p-3.5 sm:py-3.5 rounded-full bg-[#303030] shadow-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Ask anything"
            className="w-full px-3 bg-transparent outline-none text-white text-xl placeholder:text-xl"
          />
          <button
            type="submit"
            onClick={getResponse}
            className="p-2 rounded-full bg-white cursor-pointer shrink-0"
          >
            <ArrowUp className="text-black" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
