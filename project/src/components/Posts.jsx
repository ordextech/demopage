import { useEffect, useState } from "react";
import { getDocs,collection, where,  query } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "react-bootstrap/Modal";
import Comments from "./modals/Comments";
import { useNavigate } from "react-router-dom";
import CreateChannel from "./CreateChannel";

function Posts({channel}) {
    
    const [commentShow, setCommentShow] = useState(false);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState();
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(channel.id);
    
    const navigate = useNavigate();
    const emailVarify = localStorage.getItem("email");
    
    useEffect(() => {
        getPosts();
        setCurrentChannel(channel.id);
    }, []);

    const getPosts = async (id = channel.id) => {
        let items =[];
        const q = query(collection(db, "posts"), where("channelId", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            items.push({id : doc.id, data : doc.data()});
        });
        setPostList(items);
    }; 

    const viewPost = (id) => {
        navigate('/viewpost', { state : {
            postId: id,
            channel : channel
        }})
    }

    const reply = async (id) => {
        setCommentShow(true);
        setPostId(id);
    }

    const noPosts = (
        <div className="container my-3">
            No Posts found in <strong>{channel.channelName}</strong>.
        </div>
    );

    const addPost = () => {
        navigate('/createpost', {state : {channel}});
    }

    if(currentChannel !== channel.id) 
    {
        getPosts();
        setCurrentChannel(channel.id);
    }

    const posts = postList.map((post) => {
        return (
            <>
                <div className='col-12' onClick={() => {viewPost(post.id);}}>
                    <div className="card my-3">
                        <div className="container">
                            <div className="row mb-2">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h3 className="card-title">{post.data.subject}</h3>        
                                    </div>
                                </div>
                                <p className="card-text">
                                    {post.data.body}
                                </p>
                                <hr className=""/>
                                <div className="d-flex justify-content-between">
                                    <h6 className="author">@{post.data.authorName}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    });

    return (
        <>
            {posts.length > 0 ? posts : noPosts}
            <div className="container">
                <button className="btn btn-dark" onClick={addPost}>Add Post</button>
            </div>
        </>
    );
}
export default Posts;
