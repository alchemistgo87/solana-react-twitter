import { useState } from "react";

export const TweetSearch = (props) => {
  const { modelValue, placeholder, search, icon } = props;
  const [searchTopic, setSearchTopic] = useState(modelValue);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search(searchTopic);
    }
  };

  return (
    <>
      <div className="relative border-b">
        <input
          type="text"
          className="text-gray-700 w-full pl-16 pr-32 py-4 bg-gray-50"
          placeholder={placeholder}
          value={searchTopic}
          onChange={(e) => setSearchTopic(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <div
          className={`${
            modelValue ? "text-gray-700" : "text-gray-400"
          } absolute left-0 inset-y-0 flex items-center justify-center pl-8 pr-2`}
        >
          <slot>{icon}</slot>
        </div>

        <div className="absolute right-0 inset-y-0 flex items-center pr-8">
          <button
            className={`${
              !!searchTopic
                ? "text-gray-700 bg-gray-300 hover:bg-gray-400 hover:text-white"
                : "text-gray-400 bg-gray-200 cursor-not-allowed"
            } rounded-full px-4 py-1  font-semibold`}
            disabled={!searchTopic}
            onClick={() => search(searchTopic)}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};
