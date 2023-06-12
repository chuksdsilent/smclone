import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import "./stories.scss"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import PreviewStory from '../previewStory/PreviewStory';
import { convertBase64 } from '../../utils';
const Stories = () => {
    const { currentUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const { isLoading, error, data } = useQuery(["stories"], () =>
        makeRequest.get("/stories").then((res) => {
            return res.data;
        })
    );

    const upload = async (file) => {
        console.log(file)
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newPost) => {
            return makeRequest.post("/stories", newPost);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                setFile(null);
                setLoading(false)
                queryClient.invalidateQueries(["stories"]);
            },
        }
    );

    const handleClick = async (e) => {
        e.preventDefault();

        if (file.size > 5000000) {
            alert("File must not be more than 5mb")
            setFile(null);
            setLoading(false)
        } else {
            const imgUrl = await convertBase64(file)
            mutation.mutate({ userId: currentUser.id, img: imgUrl });
            setLoading(true)
        }
    };

    const closeModal = () => {
        setFile(null);

    }

    //TEMPORARY
    const stories = [
        {
            id: 1,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 2,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 3,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 4,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
    ];

    return (
        <div className="stories">

            {file ? <PreviewStory closeModal={closeModal} loading={loading} setLoading={setLoading} file={file} handleClick={handleClick} /> : ""}
            <div className="story">
                {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

                <span>Create Story</span>

                <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload">
                    <i>+</i>
                </label>
            </div>
            {isLoading ? "loading..." : data.map(story => (
                <div className="story" key={story.id}>
                    <img src={story.img} alt="" />
                    <span>{story.name}</span>
                    {story.profilePic ? (<img src={story.profilePic} alt="" className='rounded-pics' />) : (<img className='rounded-pics' src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}
                </div>
            ))}
        </div>
    )
}

export default Stories