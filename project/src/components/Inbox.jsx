import React, { useState, useEffect } from "react";
import "./style.css";
import Channels from "./Channels";
import { getDocs,collection, where,  query, doc, updateDoc, documentId } from "firebase/firestore";
import {auth, db} from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Compose from "./modals/Compose";
import Overlay from "./Overlay";

const Inbox = () => {

    const email = auth.currentUser !== null ? auth.currentUser.email : " ";   
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState("");
    const [showPosts, setShowPosts] = useState(false);
    const [showInbox, setShowInbox] = useState(false);
    const [inboxData, setInboxData] = useState([]);
    const [compose, setCompose] = useState(false);
    const [inboxAudience, setInboxAudience] = useState([]);

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
        setUserData();
    },[]);

    const getMyChannels = async () => {
        let userChannels;
        let items = [];
        const usersCollectionRef = collection(db, "users");
        let userQuery = query(usersCollectionRef, where ("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            userChannels = data.channels;
        });

        if(userChannels)
        {
            let channelList = userChannels.split(",")
            const channelsCollectionRef = collection(db, "channels");
            channelList.forEach(async (channel) => {
                let Query = query(channelsCollectionRef, where (documentId(), "==", channel.trim()));
                const querySnapshot = await getDocs(Query);
                querySnapshot.forEach((doc) => {
                    items.push({id : doc.id, data : doc.data()});
                });
            });
            //
        }
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

    const setUserData = async() => {
        if(inboxData.length > 0)
        {
            let users = [];
            let items = [];
            inboxData.forEach((message) => {
                users.push(message.data.authorId);
            });
            const channelsCollectionRef = collection(db, "users");
            let Query = query(channelsCollectionRef, where ("uid", "in", [ ...new Set(users)]));
            const querySnapshot = await getDocs(Query);
            querySnapshot.forEach((doc) => {
                items.push({id : doc.id, data : doc.data()});
            });
            setInboxAudience(items);
        }
    }

    const getUserImage = (userId) => {
        let user = inboxAudience.filter((audience) => {
            return audience.data.uid === userId
        })
        if(user.length > 0)
        {
            return user[0].data.image;
        }
        else {
            console.log("userId")
            return "";
        }
    }

    return(
        <>
            <div className="col-11">
                <div className="row">
                    <div className="col-12 col-md-3 channels">
                        <Channels channels = {channels}  setSelectedChannel = {setSelectedChannel} selectedChannel = {selectedChannel} inboxCount = {inboxData.length} />
                    </div>
                    <div className="col-12 col-md-9">
                        <div className="container ">
                            <div className="d-flex ms-5 py-3">
                                <h2 className="me-auto">test forum 1</h2>
                                <Overlay userData = {auth.currentUser} channelData = {selectedChannel}/>
                            </div>
                            {inboxData.map((message) => {
                                const responseRequested = message.data.response;
                                const messageTime = new Date(message.data.addedOn).getDay();
                                let timeStamp;
                                if(messageTime === new Date().getDay()) 
                                {
                                    timeStamp = new Date(message.data.addedOn).toLocaleTimeString();
                                }
                                else {
                                    timeStamp = new Date(message.data.addedOn).toLocaleDateString();
                                }
                                return (
                                    <table className="table table-hover">
                                        <tbody>
                                            <tr className="align-middle">
                                                <td>
                                                    <div className="text-center">
                                                        <img src= {getUserImage(message.data.authorId)} style={{width: "25%"}} className="img-fluid rounded-pill" />
                                                    </div>
                                                </td>
                                                <td className="big-col">{message.data.authorName}</td>
                                                <td>
                                                    <div>
                                                        <small className="text-muted"># {message.data.channelName}</small>
                                                        <p className="text-wrap">{message.data.subject}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    {timeStamp}
                                                </td>
                                                {responseRequested.includes(auth.currentUser.uid) &&
                                                    <td>
                                                        <div className="btn btn-danger">
                                                            Response Requested
                                                        </div>
                                                    </td>
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};


export default Inbox;