import React, { useState } from 'react'
import "./previewStory.scss"
import SendIcon from '@mui/icons-material/Send';
const PreviewStory = ({ file, handleClick, closeModal, loading, setLoading }) => {

    return (
        <div className="preview-story">
            <div className="wrapper">
                <div className="top">
                    <h1>Do you want to share?</h1>
                    <button onClick={closeModal}>Close</button>
                </div>
                <img src={URL.createObjectURL(file)} alt="" />
                {loading ? (<div>Uploading...</div>) : (<button onClick={handleClick}><SendIcon /></button>)}
            </div>
        </div>
    )
}

export default PreviewStory