import React, { useState } from 'react'
import "./rightbar.scss"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useEffect } from 'react';
import moment from "moment";

const Rightbar = () => {

    const [users, setUsers] = useState([])
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery(["users"], () =>
        makeRequest.get("/users").then((res) => {
            setUsers(res.data)
            return res.data;
        })
    );

    const { isLoading: aLoading, error: aError, data: aData } = useQuery(["getActivities"], () =>
        makeRequest.get("/users/activities").then((res) => {
            setUsers(res.data)
            return res.data;
        })
    );

    const { isLoading: oLoading, error: oError, data: oData } = useQuery(["getFriends"], () =>
        makeRequest.get("/users/friends").then((res) => {
            setUsers(res.data)
            return res.data;
        })
    );

    console.log("users", users)
    const mutation = useMutation(
        (userId) => {
            return makeRequest.post("/relationships", { userId });
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(["users"]);
            },
        }
    );
    const handleFollow = (userId) => {
        mutation.mutate(userId);

    }

    const handleDismiss = (userId) => {
        console.log('clicked')
        const filteredUsers = data.filter(user => {
            return user.id !== userId
        })
        setUsers(filteredUsers)
    }
    return (
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Suggestions For You</span>
                    <div>
                        {isLoading ? "loading..." : users.map((user, index) => (
                            <div className="user" key={user.id}>
                                <>
                                    <div className="userInfo">
                                        {user.profilePic ? (<img src={user.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

                                        <span>{user.name}</span>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={() => handleFollow(user.id)}>follow</button>
                                        <button onClick={() => handleDismiss(user.id)}>dismiss</button>
                                    </div>
                                </>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="item">
                    <span>Latest Activities</span>
                    {
                        aLoading ? "loading..." : aData.map((user, index) => (

                            <div className="user">
                                <div className="userInfo">
                                    {user.profilePic ? (<img src={user.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

                                    <p>
                                        <span>{user.name}</span> {user.desc}
                                    </p>
                                </div>
                                <span style={{ fontsize: "12px" }}>{moment(user.createdAt).fromNow()}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="item">
                    <span>Online Friends</span>
                    <>
                        {
                            oLoading ? "loading..." : oData.map((user, index) => (

                                <div className="user">
                                    <div className="userInfo">
                                        {user.profilePic ? (<img src={"/upload/" + user.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}

                                        <div className="online" />
                                        <span>{user.name}</span>
                                    </div>
                                </div>
                            ))

                        }
                    </>
                </div>
            </div>
        </div>
    )
}

export default Rightbar