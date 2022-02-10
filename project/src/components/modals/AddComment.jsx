import { useState } from "react";
import {addDoc, collection} from "firebase/firestore";
import { auth, db } from "../components/firebase";

function AddComment({postId,onHide}) 
{
    const [comment, setComment] = useState("");
    const commentsCollectionRef = collection(db,"comments");
    
    const submitComment = async () => {
        await addDoc(commentsCollectionRef, {
            comment,
            postId,
            authorName : auth.currentUser.displayName,
            authorId : auth.currentUser.uid,
            addedOn : +new Date()
        });
        onHide();
    };

    return (
        <div className="commentStyle">
            <div className="styleContainer">
                <div className="inputGp">
                    <label>Comment:</label>
                    <textarea onChange={(e) => {setComment(e.target.value)}} required/>
                </div>
                <button onClick={submitComment}>Submit</button>
            </div>
        </div>
    );
}

export default AddComment;