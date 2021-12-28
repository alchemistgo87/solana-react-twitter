import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTweets, topicFilter } from "../api/fetch-tweets";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { TweetSearch } from "../components/TweetSearch";
import { useSlug } from "../hooks/useSlug";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

export const Topics = () => {
  const navigate = useNavigate();
  const workspace = useContext(WorkspaceContext);
  let { topicSlug } = useParams();

  const [topic, setTopic] = useState(topicSlug);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedTopic, setViewedTopic] = useState("");

  const slugTopic = useSlug(topic);

  // Actions.
  const addTweet = (tweet) => setTweets([...tweets, tweet]);

  const search = (newTopic) => {
    setTopic(newTopic);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate(`/topics/${newTopic}`);
  };

  useEffect(() => {
    const fetchTopicTweets = async () => {
      if (slugTopic === viewedTopic) return;
      try {
        setLoading(true);
        const fetchedTweets = await fetchTweets(workspace, [
          topicFilter(slugTopic),
        ]);
        setTweets(fetchedTweets);
        setViewedTopic(slugTopic);
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchTopicTweets();
    } else {
      setTweets([]);
      setViewedTopic("");
    }
  }, [slugTopic, topic, viewedTopic, workspace]);

  return (
    <div>
      <TweetSearch
        placeholder="Search for a topic..."
        modelValue={slugTopic}
        search={search}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
              clipRule="evenodd"
            />
          </svg>
        }
      ></TweetSearch>

      {viewedTopic && (
        <div>
          <TweetForm added={addTweet} forcedTopic={viewedTopic}></TweetForm>
          <TweetList tweets={tweets} loading={loading}></TweetList>
          {tweets.length === 0 && (
            <div className="p-8 text-gray-500 text-center">
              No tweets were found in this topic...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
