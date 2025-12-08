import { ArrowUp } from "lucide-react";
import { useState, type ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../api/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

interface AIResponse {
  success: boolean;
  reply?: string | number;
  message?: string;
}

export default function Chat(): ReactElement {
  const [query, setQuery] = useState<string>("");
  const [querySent, setQuerySent] = useState<boolean>(false);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [response, setResponse] = useState<string | number | null>(null);
  const [threadId, setThreadId] = useState<string>(uuidv4());

  const { getToken } = useAuth();
  const { user } = useUser();

  const getResponse = async (): Promise<void> => {
    if (!query) return;
    setLastQuery(query);
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
    <div className="h-screen w-full flex flex-col items-center px-4">
      {/* Chat container */}
      <div
        className={`w-full max-w-4xl flex flex-col flex-1 overflow-y-auto py-6 gap-6`}
      >
        {/* User message */}
        {querySent ? (
          <div className="w-full text-right">
            <p className="inline-block px-4 py-2 bg-[#303030] rounded-lg">
              {lastQuery}
            </p>
          </div>
        ) : (
          <div className="translate-y-80 space-y-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              Hi {user?.firstName}, Where should we start?
            </h1>

            <div className="w-full max-w-4xl flex items-center gap-3 p-4 bg-[#303030] rounded-full mb-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Ask anything"
                className="w-full px-3 bg-transparent outline-none text-white text-xl"
              />
              <button
                type="submit"
                disabled={!query}
                onClick={getResponse}
                className="p-2 rounded-full bg-white shrink-0 disabled:opacity-20 cursor-pointer"
              >
                <ArrowUp className="text-black" size={22} />
              </button>
            </div>
          </div>
        )}

        {/* AI response */}
        {response && (
          <div className="w-full text-left">
            <p className="inline-block px-4 py-2 rounded-lg">{response}</p>
          </div>
        )}
      </div>

      {/* Input bar */}
      {querySent && (
        <div className="w-full max-w-3xl flex items-center gap-3 p-4 bg-[#303030] rounded-full mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Ask anything"
            className="w-full px-3 bg-transparent outline-none text-white text-xl"
          />
          <button
            type="submit"
            disabled={!query}
            onClick={getResponse}
            className="p-2 rounded-full bg-white shrink-0 disabled:opacity-20 cursor-pointer"
          >
            <ArrowUp className="text-black" size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
