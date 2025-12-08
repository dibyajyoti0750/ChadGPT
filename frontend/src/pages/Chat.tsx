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
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const InputBar = (
    <div className="w-full max-w-4xl flex items-center gap-3 p-4 bg-[#303030] rounded-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Ask anything"
        className="w-full px-3 bg-transparent outline-none text-white text-xl"
      />
      <button
        disabled={!query}
        onClick={getResponse}
        className="p-2 rounded-full bg-white shrink-0 disabled:opacity-20 cursor-pointer"
      >
        <ArrowUp className="text-black" size={22} />
      </button>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center px-4">
      {/* Chat Area */}
      <div className="w-full max-w-4xl flex flex-col flex-1 overflow-y-auto py-6 gap-6">
        {!querySent && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              Hi {user?.firstName}, Where should we start?
            </h1>
            {InputBar}
          </div>
        )}

        {querySent && (
          <>
            <div className="text-right">
              <p className="inline-block px-6 py-4 text-lg bg-[#303030] rounded-full">
                {lastQuery}
              </p>
            </div>

            {response && (
              <div className="text-left">
                <p className="inline-block p-6 text-lg rounded-lg">
                  {response}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom input bar when chat has started */}
      {querySent && (
        <div className="w-full flex justify-center mb-6">{InputBar}</div>
      )}
    </div>
  );
}
