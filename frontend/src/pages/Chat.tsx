import { ArrowUp, LoaderCircle } from "lucide-react";
import { useState, type ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../api/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchThreads } from "../features/chats/chatSlice";
import type { AppDispatch } from "../app/store";
import Navbar from "../components/Navbar";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface AIResponse {
  success: boolean;
  reply?: string;
  message?: string;
}

export default function Chat(): ReactElement {
  const [query, setQuery] = useState<string>("");
  const [querySent, setQuerySent] = useState<boolean>(false);
  const [previousQueries, setPreviousQueries] = useState<string[]>([]);
  const [responses, setResponses] = useState<(string | null)[]>([]);
  const [threadId] = useState<string>(uuidv4());
  const [loading, setLoading] = useState<boolean>(false);

  const { getToken } = useAuth();
  const { user } = useUser();
  const dispatch: AppDispatch = useDispatch();

  const getResponse = async (): Promise<void> => {
    if (!query) return;

    const userQuery = query;
    setPreviousQueries((prev) => [...prev, userQuery]);
    setQuery("");
    setQuerySent(true);

    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await api.post<AIResponse>(
        "/api/chat/message",
        { threadId, query: userQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setResponses((prev) => [...prev, data.reply ?? null]);
        dispatch(fetchThreads(token));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputBar = (
    <div className="w-full max-w-3xl flex items-center gap-3 p-3 bg-[#303030] rounded-full shadow-lg">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && getResponse()}
        type="text"
        placeholder="Ask anything"
        className="w-full px-4 bg-transparent outline-none text-white text-xl"
      />
      <button
        disabled={!query}
        onClick={getResponse}
        className="p-2 rounded-full bg-white shrink-0 disabled:opacity-20 cursor-pointer"
      >
        {loading ? (
          <LoaderCircle className="text-black animate-spin" size={22} />
        ) : (
          <ArrowUp className="text-black" size={22} />
        )}
      </button>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-3xl flex flex-col flex-1 overflow-y-auto py-6 gap-3 no-scrollbar">
        {!querySent && (
          <div className="flex flex-col items-center justify-center pb-60 flex-1 space-y-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              Hi {user?.firstName}, Where should we start?
            </h1>
            {InputBar}
          </div>
        )}

        {querySent && (
          <>
            {previousQueries.map((userMsg, index) => (
              <div key={index}>
                {/* User message */}
                <div className="text-right mx-2">
                  <p className="inline-block px-5 py-4 text-lg bg-[#303030] rounded-full">
                    {userMsg}
                  </p>
                </div>

                {/* AI message */}
                {responses[index] !== undefined && (
                  <div className="text-left">
                    <div className="px-5 py-3 text-lg rounded-lg [&_p]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-3">
                      <Markdown rehypePlugins={[rehypeHighlight]}>
                        {responses[index]}
                      </Markdown>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="h-5 w-5 rounded-full bg-white animate-bounce m-6"></div>
            )}
          </>
        )}
      </div>

      {querySent && (
        <div className="w-full flex justify-center mb-6">{InputBar}</div>
      )}
    </div>
  );
}
