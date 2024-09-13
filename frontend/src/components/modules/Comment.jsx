import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";

import PropTypes from "prop-types";
import moment from "moment";

const Comment = ({ comment, commentLikeHandler }) => {
  // ================ Redux ===============
  const { currentUser } = useSelector((state) => state.user);

  // ================ State ===============
  const [user, setUser] = useState({});

  // ================ Effect ===============
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);
        const responseData = await response.json();
        if (response.ok) {
          setUser(responseData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  // ================ Rendering ===============
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture || "/defaultProfilePic.jpg"} // Fallback if no profile picture
          alt={user.username || "anonymous user"}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
            onClick={() => commentLikeHandler(comment._id)}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};

// =========== Type ==================
Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    numberOfLikes: PropTypes.number.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  commentLikeHandler: PropTypes.func.isRequired,
};

export default Comment;
