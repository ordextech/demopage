import { useEffect, useState } from "react";
import { getDocs,collection, where,  query, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Channels from './Channels';
import Posts from "./Posts";
import {auth} from "../services/firebase";
import { useNavigate } from "react-router-dom";

function Inbox() {
    const email = auth.currentUser.email;   
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState("");
    const [showPosts, setShowPosts] = useState(false);
    const [showInbox, setShowInbox] = useState(false);
    const [inboxData, setInboxData] = useState([]);

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
        let items = [];
        const q = query(collection(db, "inbox"), where("audienceId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            items.push({id : doc.id, data : data})
        });
        setInboxData(items);
    }

    const redirectToSource = async(recordId, postId, channelId) => {
        deleteDoc(doc(db, "inbox", recordId)).then(() => {
            const channelData = channels.filter((channelItem) => {
                return channelItem.id === channelId
            });
            navigate('/viewpost', { state : {
                postId: postId,
                channel : channelData[0]
            }})
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
                        return(
                            <div>
                                <div className="row" onClick={() => {redirectToSource(inboxItem.id, inboxItem.data.relationId, inboxItem.data.channelId)}}>
                                    {inboxItem.data.relationType === "Post" ? 
                                        <div>
                                            <span>
                                                {inboxItem.data.authorName} Added new Post to {inboxItem.data.channelName}
                                            </span>
                                        </div>
                                    :
                                        <div>
                                            <span>
                                                {inboxItem.data.authorName} Added new comment on one of the post in {inboxItem.data.channelName}
                                            </span>
                                        </div>
                                    }
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
                <div className="col-12">
                    <div className="row">
                        <Channels channels = {channels} selectedChannel = {selectedChannel} viewPosts = {viewPosts} inbox = {true} viewInbox = {viewInbox}></Channels>
                        <div className= "col-md-6">
                            {showPosts && !showInbox ?
                                <div className="container" style = {{cursor  : "pointer"}}>
                                    <Posts channel = {selectedChannel}/>
                                </div>
                                :
                                <div className="container" style = {{cursor  : "pointer"}}>
                                    {InboxComponent}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
