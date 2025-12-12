import { ArrowUp, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, setThreadId } from "../features/chats/chatSlice";
import type { AppDispatch, RootState } from "../app/store";
import Navbar from "../components/Navbar";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function Chat(): ReactElement {
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loading = useSelector((state: RootState) => state.chat.loading);
  const threadId = useSelector((state: RootState) => state.chat.threadId);
  const previousQueries = useSelector(
    (state: RootState) => state.chat.previousQueries
  );
  const responses = useSelector((state: RootState) => state.chat.responses);

  const { getToken } = useAuth();
  const { user } = useUser();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setThreadId(uuidv4()));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dispatch]);

  const getResponse = async () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (!query || !threadId) return;
    const token = await getToken();

    dispatch(sendMessage({ threadId, query, token })).then(() => {
      if (bottomRef.current && inputRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
        inputRef.current.focus();
      }
    });

    setQuery(""); // clear input
  };

  const InputBar = (
    <div className="w-full max-w-3xl flex items-center gap-3 p-3 bg-[#303030] rounded-full shadow-lg">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && getResponse()}
        type="text"
        placeholder="Ask anything"
        className="w-full px-4 bg-transparent outline-none text-white text-xl"
      />
      <button
        disabled={!query || loading}
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
        {previousQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center pb-60 flex-1 space-y-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              Hi {user?.firstName}, Where should we start?
            </h1>
            {InputBar}
          </div>
        ) : (
          <>
            {previousQueries.map((userMsg, index) => (
              <div key={index}>
                {/* User message */}
                <div className="text-right mx-2">
                  <p className="inline-block max-w-[400px] px-5 py-4 text-lg bg-[#303030] rounded-3xl wrap-break-word whitespace-pre-wrap">
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
        <div ref={bottomRef} className="pb-20"></div>
      </div>

      {previousQueries.length > 0 && (
        <div className="w-full flex justify-center mb-6">{InputBar}</div>
      )}
    </div>
  );
}
