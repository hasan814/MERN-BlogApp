import { useState, useMemo, useEffect } from "react";
import { Alert, Button, Textarea } from "flowbite-react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import toast from "react-hot-toast";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  // =============== State =================
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  console.log(comments);
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
      const responseData = await response.json();

      if (response.ok) {
        setComment("");
        setCommentError(null);
        setComments([responseData, ...comments]);
        toast.success("Comment Post Successfully");
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  // =============== Effect =================
  useEffect(() => {
    const getComment = async () => {
      try {
        const response = await fetch(`/api/comment/getPostComments/${postId}`);
        const responseData = await response.json();
        if (response.ok) {
          setComments(responseData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComment();
  }, [postId]);

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
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comment Yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={uuidv4()} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

// =============== PropTypes Validation =================
CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
