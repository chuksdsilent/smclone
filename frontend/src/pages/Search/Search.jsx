import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { makeRequest } from '../../axios';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search_item")
    const [users, setUsers] = useState([]);

    let { isLoading, error, data } = useQuery(["search"], () =>
        makeRequest.get(`/users/search/${search}`).then((res) => {
            return res.data;
        })
    );

    const mutation = useMutation(
        (userId) => {
            return makeRequest.post("/relationships", { userId });
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                alert("You have followed a friend")
            },
        }
    );
    const handleFollow = (userId) => {
        mutation.mutate(userId);

        data = data.filter(user => {
            return user.id !== userId
        })
    }

    const handleDismiss = (userId) => {
        console.log('clicked')
        const filteredUsers = data.filter(user => {
            return user.id !== userId
        })
        setUsers(filteredUsers)
    }
    return (
        <div className='rightBar'>
            <div className="container">
                <div className="item">
                    <h2 style={{ marginBottom: "1rem" }}>Friends Found</h2>
                    <div>
                        {isLoading ? "loading..." : data.map((user, index) => (
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
            </div>
        </div>
    )
}

export default Search