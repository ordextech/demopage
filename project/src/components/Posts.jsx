import { useEffect, useState } from "react";
import { getDocs,collection, where,  query } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "react-bootstrap/Modal";
import Comments from "./modals/Comments";
import { useNavigate } from "react-router-dom";
import CreateChannel from "./CreateChannel";

function Posts() {
    const [commentShow, setCommentShow] = useState(false);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState();
    const [channels, setChannels] = useState([]);

    const emailVarify = localStorage.getItem("email");
    const q = query(collection(db, "channels"), where("channelDomain", "==", 
    emailVarify!==null?emailVarify.split("@")[1]:""));

    return (
        <div>
            <div className='col-12 col-sm-6 col-md-4 my-3 my-lg-0'>
	            <div className="card">
                    <div className="container">
                        <div className="row mb-2">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h3 className="card-title">{post.data.subject}</h3>        
                            </div>
                        </div>
                        <p className="card-text" onClick={() => {viewPost(post.id);}}>
                            {post.data.body}
                        </p>
                        <hr className=""/>
                        <div className="d-flex justify-content-between">
                            <h6 className="author">@{post.data.authorName}</h6>
                            <div className="addComment">
                                {isUserSignedIn && (
                                    <i class="fas fa-comment-dots" 
                                        onClick={() => {
                                            reply(post.id);
                                        }}
                                    >
                                    </i>
                                )}
                            
                            </div>
                        </div>
                    </div>
                    </div>
	            </div>
	        </div>
        </div>
    );
}

export default Posts;
