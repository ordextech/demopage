import { useEffect, useState } from "react";
import { getDocs,collection, where,  query } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "react-bootstrap/Modal";
import Comments from "./modals/Comments";
import { useNavigate } from "react-router-dom";

function HomePage({isUserSignedIn})
{
    const [commentShow, setCommentShow] = useState(false);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState();

    const emailVarify = localStorage.getItem("email");
    const q = query(collection(db, "posts"), where("authorDomain", "==", 
    emailVarify!==null?emailVarify.split("@")[1]:""));
    
    let navigate = useNavigate();
    
    useEffect(() => {
        getPosts();
    },[]);

    const getPosts = async () => {
        let items =[];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            items.push({id : doc.id, data : doc.data()});
        });
        setPostList(items);
    };

    const viewPost = (id) => {
        navigate('/viewpost', { state : {
            postId: id,
        }})
    }

    const reply = async (id) => {
        setCommentShow(true);
        setPostId(id);
    }
    
    return(
    <div className="container homePage">
        <div className="col-12">
            <div className="row">
               {isUserSignedIn && (postList.map((post) => {
                   return (
                    <>

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
                    </>
                   );
                }))}

                <Modal
                show={commentShow}
                size="lg"
                onHide={() => setCommentShow(false)}
                aria-labelledby="example-custom-modal-styling-title"
                modal-90w
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Comments
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Comments
                            postId={postId}
                            onHide={() => setCommentShow(false)}
                        />
                    </Modal.Body>
                </Modal>
           </div>
        </div>
    </div>
    );
}
export default HomePage;