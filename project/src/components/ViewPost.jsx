import React from 'react';
import { useState, useEffect } from "react";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../services/firebase";
import { useLocation } from 'react-router-dom';
import Comments from './modals/Comments';

function ViewPost() 
{
    const { state } = useLocation();

    const postCollectionRef = collection(db,"posts");

    const [postList, setPostList] = useState([]);
    const postId = state.postId;

    useEffect(() => {
        getPosts();
    },[]);

    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
  
      setPostList(data.docs.map((doc) => ({
                ...doc.data(), id:doc.id
      })));
    }

    return (
        <div div className="col-8 container ">
            {postList.map((p) => {
                return (
                    p.id===postId ? (
                    <div className='my-5 bg-light p-4'>
                        <h6>
                            @{p.authorName}
                        </h6>
                        <div className='my-3'>
                            <h3>{p.subject}</h3>
                        </div>

                        <div>
                            {p.body}
                        </div>

                    </div>
                    ) : ""
                );
            })} 
                <h4>Comments </h4>
                <div className="comment_page">
                    <Comments postId={postId}/>
                </div>
        </div>
  );
}

export default ViewPost;