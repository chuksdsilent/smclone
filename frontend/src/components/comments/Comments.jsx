import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
    const [desc, setDesc] = useState("");
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(["comments"], () =>
        makeRequest.get("/comments?postId=" + postId).then((res) => {
            return res.data;
        })
    );

    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newComment) => {
            return makeRequest.post("/comments", newComment);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(["comments"]);
            },
        }
    );

    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({ desc, postId });
        setDesc("");
    };

    return (
        <div className="comments">
            <div className="write">
                {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}
                <input
                    type="text"
                    placeholder="write a comment"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <button onClick={handleClick}>Send</button>
            </div>
            {error
                ? "Something went wrong"
                : isLoading
                    ? "loading"
                    : data.map((comment) => (
                        <div className="comment">
                            {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

                            <div className="info">
                                <span>{comment.name}</span>
                                <p>{comment.desc}</p>
                            </div>
                            <span className="date">
                                {moment(comment.createdAt).fromNow()}
                            </span>
                        </div>
                    ))}
        </div>
    );
};

export default Comments;
