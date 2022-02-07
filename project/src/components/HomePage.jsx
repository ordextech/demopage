import { useEffect, useState } from "react";
import { getDocs,collection, where,  query } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "react-bootstrap/Modal";
import Comments from "./modals/Comments";
import { useLocation, useNavigate } from "react-router-dom";
import CreateChannel from "./CreateChannel";
import Posts from "./Posts";
import Channels from "./Channels";

function HomePage({isUserSignedIn})
{
    const [commentShow, setCommentShow] = useState(false);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState();
    const [channels, setChannels] = useState([]);
    const [showPosts, setShowPosts] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState("");

    const location = useLocation();

    const email = localStorage.getItem("email");
    const q = query(collection(db, "channels"), where("channelDomain", "==", 
    email !== null ? email.split("@")[1]  :""));
    
    let navigate = useNavigate();
    
    useEffect(() => {
        getMyChannels();
    },[]);


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

    const viewPosts = (item) => {
        setShowPosts(true);
        setSelectedChannel(item);
    }

    if(location.state !== null && location.state !== undefined && selectedChannel === "")
    {
        viewPosts(location.state);
    }
    
    return(
    <div className="container homePage">
        <div className="col-12">
            <div className="row">
                <Channels channels = {channels} selectedChannel = {selectedChannel} viewPosts = {viewPosts} inbox = {false}></Channels>
                <div className="col-md-6 my-3">
                    {isUserSignedIn && 
                        <CreateChannel addNewChannel = {addNewChannel} />
                    }
                    {showPosts &&

                        <div className="container" style = {{cursor  : "pointer"}}>
                            <Posts channel = {selectedChannel}/>
                        </div>
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