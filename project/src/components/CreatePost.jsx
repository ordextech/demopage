import { useState, useEffect } from "react";
import {addDoc, collection} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import {useNavigate} from "react-router-dom";

function CreatePost({isUserSignedIn})
{
    const [subject,setSubject] = useState("");
    const [body,setBody] = useState("");
    const postCollectionRef = collection(db, "posts");
    let navigate= useNavigate();

    const submitPost = async () => {
        await addDoc(postCollectionRef, {
            subject,
            body,
            authorId : auth.currentUser.uid,
            authorName : auth.currentUser.displayName,
            authorDomain : auth.currentUser.email.split("@")[1],
        });
        navigate("/");
    };

    useEffect(() => {
        if(!isUserSignedIn) {
            navigate("/login");
        }
    },[]);

    return(
    <div className="createPostPage">
        <div className="container">
            <div className="col-12 col-md-6 mx-auto">
                <div className="cpCard rounded bg-light shadow p-5">
                     <h3 className="text-center">Create Post</h3>
                     <div className="form">
                         <div className="my-4">
                             <label className="form-label">Subject</label>
                             <input className="form-control" onChange={(e) => {setSubject(e.target.value)}} required placeholder="Enter Post title" /> 
                         </div>

                         <div className="my-4">
                             <label className="form-label">Description</label>
                             <textarea className="form-control" rows={4} onChange={(e) => {setBody(e.target.value)}} required/>
                         </div>

                         <button className="btn btn-log" onClick={submitPost}>Submit Post</button>

                     </div>
                </div>
            </div>
        </div>
    </div>
    );
}
export default CreatePost;