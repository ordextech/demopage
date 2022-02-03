import { useEffect, useState } from "react";
import { getDocs,collection, where,  query } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "react-bootstrap/Modal";
import Comments from "./modals/Comments";
import { useNavigate } from "react-router-dom";
import CreateChannel from "./CreateChannel";

function HomePage({isUserSignedIn})
{
    const [commentShow, setCommentShow] = useState(false);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState();
    const [channels, setChannels] = useState([]);

    const emailVarify = localStorage.getItem("email");
    const q = query(collection(db, "channels"), where("channelDomain", "==", 
    emailVarify!==null?emailVarify.split("@")[1]:""));
    
    let navigate = useNavigate();
    
    useEffect(() => {
        //getPosts();
        getMyChannels();
    },[]);

    const getPosts = async () => {
        let items =[];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            items.push({id : doc.id, name : data.name});
        });
        setPostList(items);
    };

    const getMyChannels = async () => {
        let items =[];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            items.push({id : doc.id, channelName : data.channelName});
        });
        setChannels(items);
    };

    const addNewChannel = (channel) => {
        setChannels(channels.concat([channel]));
    }

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
                <div className="col-md-3">
                    <span className="my-3"><h3>My Channels</h3></span>
                    {/* <div className="card my-2" style={{textAlign : "center"}}>Channel 1</div>
                    <div className="card my-2" style={{textAlign : "center"}}>Channel 2</div>
                    <div className="card my-2" style={{textAlign : "center"}}>Channel 3</div>
                    <div className="card my-2" style={{textAlign : "center"}}>Channel 4</div>
                    <div className="card my-2" style={{textAlign : "center"}}>Channel 5</div> */}
                    {channels.map((item) => {
                        return (
                            <div className="card my-2" style={{textAlign : "center"}}>
                                {item.channelName}
                            </div>
                        );
                    })}
                </div>
                <div className="col-md-6">
                {isUserSignedIn && 
                    <CreateChannel addNewChannel = {addNewChannel}/>
                }
                </div>
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