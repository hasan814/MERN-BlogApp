import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import moment from "moment";

const Comment = ({ comment }) => {
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
      <div className="flex-shirink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
};

// =========== Type ==================
Comment.propTypes = {
  comment: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
