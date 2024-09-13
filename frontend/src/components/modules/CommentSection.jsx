import { Alert, Button, Textarea } from "flowbite-react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import toast from "react-hot-toast";

const CommentSection = ({ postId }) => {
  // =============== State =================
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  // =============== Redux =================
  const { currentUser } = useSelector((state) => state.user);

  // =============== Submit Function =================
  const submitHandler = async (event) => {
    event.preventDefault();
    if (comment.length > 200) return;

    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?._id,
        }),
      });

      if (response.ok) {
        setComment("");
        setCommentError(null);
        toast.success("Comment Post Successfully");
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  // =============== Memoized JSX for Current User =================
  const currentUserInfo = useMemo(
    () =>
      currentUser && (
        <div className="flex items-center gap-1 my-5 text-gray-500">
          <p>Signed in as: </p>
          <img
            src={currentUser.profilePicture}
            alt="profileComment"
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ),
    [currentUser]
  );

  // =============== Rendering =================
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        currentUserInfo
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-2">
          You must be signed in to Comment.
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={submitHandler}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            rows="3"
            maxLength="200"
            value={comment}
            placeholder="Add a comment..."
            onChange={({ target: { value } }) => setComment(value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};

// =============== PropTypes Validation =================
CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
