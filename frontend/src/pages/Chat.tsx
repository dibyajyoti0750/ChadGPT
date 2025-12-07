import { ArrowUp } from "lucide-react";
import { useState, type ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

interface AIResponse {
  success: boolean;
  reply?: string | number;
  message?: string;
}

export default function Chat(): ReactElement {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string | number | null>(null);
  const [threadId, setThreadId] = useState<string>(uuidv4());
  const [querySent, setQuerySent] = useState<boolean>(false);

  const { getToken } = useAuth();

  const getResponse = async (): Promise<void> => {
    if (!query) return;
    setQuery("");
    setQuerySent(true);

    try {
      const token = await getToken();

      const { data } = await api.post<AIResponse>(
        "/api/chat/message",
        { threadId, query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setResponse(data.reply ?? null);
        console.log(response);
      } else {
        toast.error(data.message ?? "Unknown error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <div
        className={`w-full h-full max-w-3xl flex flex-col items-center gap-8 mb-16 transition-all duration-200 ${
          querySent ? "translate-y-250" : "translate-y-100"
        }`}
      >
        <div className="transition-all duration-500 ease-out">
          {querySent ? (
            <div>{response}</div>
          ) : (
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              What's on your mind today?
            </h1>
          )}
        </div>

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
            disabled={!query}
            onClick={getResponse}
            className="p-2 rounded-full bg-white cursor-pointer shrink-0 disabled:opacity-20"
          >
            <ArrowUp className="text-black" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
