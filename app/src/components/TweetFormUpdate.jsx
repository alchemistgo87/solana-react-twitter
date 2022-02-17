import { useContext, useRef, useState } from "react";
import { useAutoresizeTextarea } from "../hooks/useAutoresizeTextarea";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import { useSlug } from "../hooks/useSlug";
import { useWallet } from "@solana/wallet-adapter-react";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";
import { updateTweet } from "../api/update-tweet";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const TweetFormUpdate = (props) => {
  const { tweet, close } = props;
  const workspace = useContext(WorkspaceContext);
  const { wallet } = workspace;

  // Form data.
  const [content, setContent] = useState(tweet.content);
  const [topic, setTopic] = useState(tweet.topic);
  const slugTopic = useSlug(topic);

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

  const authorRoute = useMemo(() => {
    if (wallet && wallet.publicKey.toBase58() === tweet.author.toBase58()) {
      return { name: "/profile", params: { author: "" } };
    } else {
      return {
        name: "/users",
        params: { author: tweet.author.toBase58() },
      };
    }
  }, [wallet, tweet]);

  // Permissions.
  const { connected } = useWallet();
  const canTweet = content && characterLimit > 0;

  // Actions.
  const update = async () => {
    if (!canTweet) return;
    await updateTweet(workspace, tweet, slugTopic, content);
    close();
  };
  if (!connected) {
    return (
      <div className="px-8 py-4 bg-gray-50 text-gray-500 text-center border-b">
        Connect your wallet to start tweeting...
      </div>
    );
  }

  return (
    <div className="px-8 py-4 border-l-4 border-primary-light">
      {/* Content field */}
      <div className="py-1">
        <h3 className="inline font-semibold" title="tweet.author">
          {/* Link to author page or the profile page if it's our own tweet */}
          <Link
            to={`${authorRoute.name}/${authorRoute.params.author}`}
            className="hover:underline"
          >
            {tweet.author_display}
          </Link>
        </h3>
        <span className="text-gray-500"> • </span>
        <time className="text-gray-500 text-sm" title="tweet.created_at">
          {/* Link to the tweet page. */}
          <Link
            to={`/tweet/${tweet.publicKey.toBase58()}`}
            className="hover:underline"
          >
            {tweet.created_ago}
          </Link>
        </time>
      </div>
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
            value={slugTopic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="absolute left-0 inset-y-0 flex pl-3 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                slugTopic ? "text-primary-light" : "text-gray-400"
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
          {/* Close button. */}
          <button
            class="text-gray-500 px-4 py-2 rounded-full border bg-white hover:bg-gray-50"
            onClick={() => close()}
          >
            Cancel
          </button>
          {/* Tweet button */}
          <button
            className={`${
              canTweet
                ? "bg-primary-light"
                : "bg-primary-extralight cursor-not-allowed"
            } text-white px-4 py-2 rounded-full font-semibold `}
            disabled={!canTweet}
            onClick={update}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetFormUpdate;
