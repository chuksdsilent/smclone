import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { convertBase64 } from "../../utils";
const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false)



  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        setLoading(false)
        queryClient.invalidateQueries(["showPosts"]);
      },
      onError: (error, context) => {
        console.log(error.response.data);
        console.log(error.response.status);
        setLoading(false)
        alert(error.response.data)
      }
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (file.size > 5000000) {
      alert("File must not be more than 5mb")
      setFile(null);
      setLoading(false)
    } else {

      let imgBase64 = "";
      if (file) imgBase64 = await convertBase64(file);
      mutation.mutate({ desc, img: imgBase64 });
      setFile(null);
      setDesc("");
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>{loading ? "loading..." : "Share"} </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
