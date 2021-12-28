import { useContext, useRef, useState } from "react";
import { sendTweet } from "../api/send-tweet";
import { useAutoresizeTextarea } from "../hooks/useAutoresizeTextarea";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import { useSlug } from "../hooks/useSlug";
import { useWallet } from "@solana/wallet-adapter-react";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

const TweetForm = (props) => {
  const { forcedTopic, added } = props;
  const workspace = useContext(WorkspaceContext);

  // Form data.
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const slugTopic = useSlug(topic);

  const effectiveTopic = forcedTopic ?? slugTopic;

  // Auto-resize the content's textarea.
  const textarea = useRef(null);
  useAutoresizeTextarea(textarea, content);

  // Character limit / count-down.
  const characterLimit = useCountCharacterLimit(content, 280);
  const characterLimitColour = () => {
    if (characterLimit < 0) return "text-red-500";
    if (characterLimit <= 10) return "text-yellow-500";
    return "text-gray-400";
  };

  // Permissions.
  const { connected } = useWallet();
  const canTweet = content && characterLimit > 0;

  // Actions.
  const send = async () => {
    if (!canTweet) return;
    const tweet = await sendTweet(workspace, effectiveTopic, content);
    added(tweet);
    setContent("");
    setTopic("");
  };
  if (!connected) {
    return (
      <div className="px-8 py-4 bg-gray-50 text-gray-500 text-center border-b">
        Connect your wallet to start tweeting...
      </div>
    );
  }

  return (
    <div className="px-8 py-4 border-b">
      {/* Content field */}
      <textarea
        ref={textarea}
        rows="1"
        className="text-xl w-full focus:outline-none resize-none mb-3"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div className="flex flex-wrap items-center justify-between -m-2">
        {/* Topic field */}
        <div className="relative m-2 mr-4">
          <input
            type="text"
            placeholder="topic"
            className="text-primary-light rounded-full pl-10 pr-4 py-2 bg-gray-100"
            value={effectiveTopic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={!!forcedTopic}
          />
          <div className="absolute left-0 inset-y-0 flex pl-3 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                effectiveTopic ? "text-primary-light" : "text-gray-400"
              } h-5 w-5 m-auto`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-6 m-2 ml-auto">
          {/* Character limit */}
          <div className={characterLimitColour()}>{characterLimit} left</div>

          {/* Tweet button */}
          <button
            className={`${
              canTweet
                ? "bg-primary-light"
                : "bg-primary-extralight cursor-not-allowed"
            } text-white px-4 py-2 rounded-full font-semibold `}
            disabled={!canTweet}
            onClick={send}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetForm;
