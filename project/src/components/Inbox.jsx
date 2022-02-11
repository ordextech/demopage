import { useEffect, useState } from "react";
import { getDocs,collection, where,  query, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Channels from './Channels';
import Posts from "./Posts";
import {auth} from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Compose from "./modals/Compose";
import warning_img from "./../img/warning.png"

function Inbox() {

    const email = auth.currentUser !== null ? auth.currentUser.email : " ";   
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState("");
    const [showPosts, setShowPosts] = useState(false);
    const [showInbox, setShowInbox] = useState(false);
    const [inboxData, setInboxData] = useState([]);
    const [compose, setCompose] = useState(false);

    const navigate = useNavigate();

    const viewPosts = (item) => {
        setShowInbox(false);
        setSelectedChannel(item);
        setShowPosts(true);
    }

    const viewInbox = () => {
        setShowInbox(true);
        setShowPosts(false);
        setSelectedChannel([]);
    }

    useEffect(() => {
        getMyChannels();
        getNotificationData();
    },[]);

    const getMyChannels = async () => {
        let items =[];
        const q = query(collection(db, "channels"), where("channelDomain", "==", 
    email !== null ? email.split("@")[1]  :""));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            items.push({id : doc.id, channelName : data.channelName});
        });
        setChannels(items);
    };

    const getNotificationData = async() => {
        let normalPosts = [];
        let items = [];
        let responseNeeded = [];
        const queryConstraints = [];
        queryConstraints.push(where("isDone", "==", false));
        queryConstraints.push(where("audienceId", "==", auth.currentUser.uid));
        const q = query(collection(db, "inbox"), ...queryConstraints);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            items.push({id : doc.id, data : data})
        });
        //objs.sort((a, b) => a.last_nom.localeCompare(b.last_nom));
        items = items.sort((a, b) => a.data.addedOn - b.data.addedOn);
        responseNeeded = items.filter((post) => {
            if(post.data.response.includes(auth.currentUser.uid))
                return post
        });
        normalPosts = items.filter((post) => {
            if(!post.data.response.includes(auth.currentUser.uid))
                return post
        });
        setInboxData(responseNeeded.concat(normalPosts));
    }

    const redirectToSource = async(recordId, postId, channelId) => {
        const channelData = channels.filter((channelItem) => {
            return channelItem.id === channelId
        });
        //markAsDone(recordId);
        navigate('/viewpost', { state : {
            postId: postId,
            channel : channelData[0]
        }})
    }

    const markAsDone = async(recordId) => {
        updateDoc(doc(db, "inbox", recordId), {isDone : true}).then(() => {
            setInboxData(inboxData.filter((item) => {
                return item.id !== recordId
            }));
        }).catch((error) => {
            console.log(error);
        });
    }

    const InboxComponent = (
        <div>
            {inboxData.length === 0 ?
                <div className = "container">
                    <hr />
                    You have reached inbox 0! 🎉
                    <hr />
                </div>
                :
                <div className = "container">
                    <hr />
                    {inboxData.map((inboxItem) => {
                        const mentionedUsers = inboxItem.data.mentioned;
                        const responseRequested = inboxItem.data.response;
                        let message;
                        if(mentionedUsers.includes(auth.currentUser.uid))
                        {
                            message = inboxItem.data.authorName + " Mentioned you in a post of " + inboxItem.data.channelName;
                        }
                        else {
                            message = inboxItem.data.authorName + " Added a new Post to " + inboxItem.data.channelName;
                        }
                        return(
                            <div>
                                {responseRequested.includes(auth.currentUser.uid) &&
                                    <div className="d-flex">
                                        <img src={warning_img} className="img-fluid  me-2" style={{width: "20px", height:"20px"}}/>
                                        <p className="text-danger">Requested Response</p>
                                    </div>
                                }
                                <div className="row" >
                                    {inboxItem.data.relationType === "Post" ? 
                                        <div className="col-md-12">
                                            <span>
                                                {message}
                                            </span>
                                        </div>
                                    :
                                        <div className="col-md-12">
                                            <span>
                                                {inboxItem.data.authorName} Added new comment on one of the post in {inboxItem.data.channelName}
                                            </span>
                                        </div>
                                    }
                                </div>
                                <div className="row">
                                    <div className="my-3 col-md-6">
                                        <button className="btn btn-dark btn-sm" onClick={() => {redirectToSource(inboxItem.id, inboxItem.data.relationId, inboxItem.data.channelId)}}>View Post</button>
                                    </div>
                                    <div className="my-3 col-md-6">
                                        <button className="btn btn-dark btn-sm" onClick={() => {markAsDone(inboxItem.id)}}>Mark as Done</button>
                                    </div>
                                </div>
                                
                                <hr />
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );

    return (
        <div>
            <div className="container homePage">
                <div className="btn btn-dark float-center" onClick={() => {setCompose(true)}}>Start a Thread</div>
                <div className="col-12">
                    <div className="row">
                        <Channels channels = {channels} selectedChannel = {selectedChannel} viewPosts = {viewPosts} inbox = {true} viewInbox = {viewInbox} inboxCount = {inboxData.length}></Channels>
                        <div className= "col-md-6">
                            {showPosts && !showInbox ?
                                <div className="container" style = {{cursor  : "pointer"}}>
                                    <Posts channel = {selectedChannel}/>
                                </div>
                                :
                                <div className="container">
                                    {InboxComponent}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {compose &&
                <Compose compose = {compose} setCompose = {setCompose} />
            }
        </div>
    );
}

export default Inbox;
