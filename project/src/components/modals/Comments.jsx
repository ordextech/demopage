import React from 'react';
import { useState, useEffect } from "react";
import {addDoc, collection, getDocs} from "firebase/firestore";
import { auth, db } from "../../services/firebase";

function Comments({postId,onHide}) 
{
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);
    const commentsCollectionRef = collection(db,"comments");
    
    const submitComment = async () => {
        await addDoc(commentsCollectionRef, {
            comment,
            postId,
            authorName : auth.currentUser.displayName,
            authorId : auth.currentUser.uid,
        });
    };

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(commentsCollectionRef);
            setCommentList(data.docs.map((doc) => ({
                ...doc.data(), id:doc.id
            })));
        };
        getPosts();
    });
    return (
    <div className='container p-3'>
        <div className="commentStyle ">
            <div className="col-12">
                <label className="form-label">Comment:</label>
                <input type="text" className="form-control" onChange={(e) => {setComment(e.target.value)}} required/>
            </div>
            <button className="btn btn-log my-4 text-start" onClick={submitComment}>Submit</button>
        </div>
    

        <div className="bg-light shadow col-12 p-3">
            <h5>All Comments</h5>
            <hr />
            {commentList.map((c) => {
            return (
                c.postId===postId ? (
                    <div className="post">
                            <div className='vstack my-2'>
                                <b>@{c.authorName}</b>
                                {c.comment}
                            </div>    
                    </div>
                ) : ""
            );
            })}
        </div>
    </div>
  );
}

export default Comments;
