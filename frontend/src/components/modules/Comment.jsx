import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import PropTypes from "prop-types";
import moment from "moment";

const Comment = ({ comment, commentLikeHandler, saveEditHandler }) => {
  // ================ Redux ===============
  const { currentUser } = useSelector((state) => state.user);

  // ================ State ===============
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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

  // ================ Function ===============
  const editHandler = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const saveHandler = async () => {
    try {
      const response = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        setIsEditing(false);
        saveEditHandler({ ...comment, content: editedContent });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================ Rendering ===============
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={
            user.profilePicture ||
            "https://img.icons8.com/color/48/gender-neutral-user.png"
          }
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
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent} // Changed to editedContent
              onChange={(event) => setEditedContent(event.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                size={"sm"}
                type="button"
                onClick={saveHandler}
                gradientDuoTone={"purpleToBlue"}
              >
                Save
              </Button>
              <Button
                type="button"
                size={"sm"}
                outline
                gradientDuoTone={"purpleToBlue"}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
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
                aria-label="Like comment"
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser?._id === comment.userId ||
                  currentUser?.isAdmin) && (
                  <button
                    type="button"
                    onClick={editHandler}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Edit comment"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
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
  saveEditHandler: PropTypes.func.isRequired,
};

export default Comment;
