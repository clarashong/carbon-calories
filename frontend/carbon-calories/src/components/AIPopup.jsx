import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const api_url = process.env.NEXT_PUBLIC_API_URL;
export default function AIPopup({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const [suggestion, setSuggestion] = useState("");
    console.log(meal); 
    useEffect(() => {
        async function fetchAISuggestion() {
            if (!meal) return ""; 
            const suggestion = await fetch(`${api_url.replace(/\/$/, "")}/suggestion`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(meal)
				}).then(res => res.json());
            console.log(suggestion);
            setSuggestion(suggestion || "No suggestion available.");
        }
		fetchAISuggestion(); 
    }, [meal])

  return (
    <div
  className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${expanded ? "w-96 h-96" : "w-16 h-16"} drop-shadow-2xl hover:bg-gray-200 bg-white`}
      style={{
        borderRadius: expanded ? "1.5rem" : "50%",
        boxShadow: "0 4px 24px rgba(123,86,36,0.25)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 text-[#4B2E09]">
          <h2 className="text-xl font-bold mb-2">AI Suggestion</h2>
          <div className="text-base text-left overflow-y-auto max-h-56 w-full px-2 mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ReactMarkdown>{suggestion}</ReactMarkdown>
          </div>
          <button
            className="mt-2 px-4 py-2 bg-[#4B2E09] text-white rounded-lg shadow"
            onClick={e => {
              e.stopPropagation();
              setExpanded(false);
            }}
          >Close</button>
        </div>
      ) : (
        <span className="text-white text-2xl font-bold">👨‍🍳</span>
      )}
    </div>
  );
}
