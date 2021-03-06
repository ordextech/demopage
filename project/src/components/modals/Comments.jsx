import React from 'react';
import { useState, useEffect } from "react";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { addToInbox } from "../../hooks/getInboxData";

function Comments({postId, onHide, channel}) 
{
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);
    const commentsCollectionRef = collection(db,"comments");
    
    const submitComment = async () => {
        if(comment.trim() === "" || comment === null)
        {
            alert("Please add comment");
        }
        else {
            const newComment = await addDoc(commentsCollectionRef, {
                comment,
                postId,
                authorName : auth.currentUser.displayName,
                authorId : auth.currentUser.uid,
                addedOn : +new Date()
            });
            const domain = auth.currentUser.email.split("@")[1];
            const inboxData = {
                authorId : auth.currentUser.uid, 
                authorName : auth.currentUser.displayName,
                channelName : channel.channelName,
                channelId : channel.id, 
                sourceId : postId,
                organizationDomain : domain,
                relationType : "Comment",
            }
            addToInbox(inboxData);
            setComment("");
        }   
    };

    const getComments = async () => {
        let items =[];
        const q = query(commentsCollectionRef, where("postId", "==", postId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            items.push({id : doc.id, data : doc.data()});
        });
        setCommentList(items);
    };

    useEffect(() => {
        getComments();
    });
    return (
    <div className='container p-3'>
        <div className="commentStyle ">
            <div className="col-12">
                <label className="form-label">Comment:</label>
                <input type="text" className="form-control" value={comment} onChange={(e) => {setComment(e.target.value)}} required/>
            </div>
            <button className="btn btn-dark my-4 text-start" onClick={submitComment}>Comment</button>
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
