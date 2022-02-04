import { useState, useEffect } from "react";
import {addDoc, collection} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import {useNavigate, useLocation} from "react-router-dom";


function CreatePost({isUserSignedIn})
{
    const location = useLocation();
    const channel = location.state.channel;
    const [subject,setSubject] = useState("");
    const [body,setBody] = useState("");
    const postCollectionRef = collection(db, "posts");
    const notificationRef = collection(db, "inbox");
    let navigate= useNavigate();

    const submitPost = async () => {
        if(subject.trim() === null || subject.trim() === "")
        {
            alert("Please Enter the post subject")
        }
        else if(body.trim() === null || body.trim() === "")
        {
            alert("Please Enter the post body");
        }
        else{
            const newPost = await addDoc(postCollectionRef, {
                subject,
                body,
                authorId : auth.currentUser.uid,
                authorName : auth.currentUser.displayName,
                channelId : channel.id
            });
            await addDoc(notificationRef, {
                audienceId : auth.currentUser.uid,
                relationId : newPost.id,
                relationType : "Post",
                isDone : false 
            });
            navigate("/", {state : channel});
        }
        
    };

    useEffect(() => {
        if(!isUserSignedIn) {
            navigate("/login");
        }
    }, []);

    return(
    <div className="createPostPage">
        <div className="container">
            <div className="col-12 col-md-6 mx-auto">
                <div className="cpCard rounded bg-light shadow p-5">
                     <h3 className="text-center">Post to {channel.channelName}</h3>
                     <div className="form">
                         <div className="my-4">
                             <label className="form-label">Subject</label>
                             <input className="form-control" onChange={(e) => {setSubject(e.target.value)}} required placeholder="Enter Post title" /> 
                         </div>

                         <div className="my-4">
                             <label className="form-label">Description</label>
                             <textarea className="form-control" rows={4} onChange={(e) => {setBody(e.target.value)}} required/>
                         </div>

                         <button className="btn btn-dark" onClick={submitPost}>Post</button>

                     </div>
                </div>
            </div>
        </div>
    </div>
    );
}
export default CreatePost;