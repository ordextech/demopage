import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import TextInput from '../Editor';
import { getUserList, addToInbox } from '../../hooks/getInboxData';
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import {auth, db} from '../../services/firebase';

function Compose(props) {
    
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [atmentionUsers, setAtmentionUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [postTo, setPostTo] = useState();
    const [notifyTo, setNotifyTo] = useState([]);
    const [selectedValue, setSelectedValue] = useState([]);
    
    const addMentionedUsers = (body) => {
        setAtmentionUsers(atmentionUsers.concat(body));
    }

    const doubleAtMention = (options) => {
        setSelectedValue(notifyTo.concat(options));
    }

    const email = auth && auth.currentUser ? auth.currentUser.email : "";

    const getUsers = async() => {
        const email = auth && auth.currentUser ? auth.currentUser.email : "";
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("organizationDomain", "==", email.split("@")[1]));
        const querySnapshot = await getDocs(q);
        let data;
        let items = [];
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                data = doc.data();
                items.push(data);
            }); 
        }
        setUsers(items);
    }

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

    useEffect(() => {
        getUsers();
        getMyChannels();
    }, [])


    const handlePost = async(e) => {
        e.preventDefault();

        if(postTo.length == 0)
        {
            alert('Please select a channel to Post')
        }
        else if(body.trim() == "")
        {
            alert("Please add content to body")
        }
        else if(subject.trim() == "")
        {
            alert("Please add Subject");
        }
        else {
            let attentionRequire = [];
            let mentionedUsers = [];
            const postCollectionRef = collection(db, "posts");
            atmentionUsers.map((user) => {
                mentionedUsers.push(user.link)
            });
            notifyTo.map((user) => {
                attentionRequire.push(user.value)
            })
            postTo.map(async(channel) => {
                const newPost = await addDoc(postCollectionRef, {
                    subject,
                    body,
                    authorId : auth.currentUser.uid,
                    authorName : auth.currentUser.displayName,
                    channelId : channel.value,
                    addedOn : +new Date()
                });
                const domain = auth.currentUser.email.split("@")[1];
                const inboxData = {
                    authorId : auth.currentUser.uid, 
                    authorName : auth.currentUser.displayName,
                    channelName : channel.label,
                    channelId : channel.value, 
                    sourceId : newPost.id,
                    organizationDomain : domain,
                    relationType : "Post",
                    mentioned : mentionedUsers.join(","),
                    response : attentionRequire.join(",")
                }
                addToInbox(inboxData);
                props.setCompose(false)
            })
        }
    }

    const handleSubject = (e) => {
        setSubject(e.target.value);
    }

    const handleTo = (selectedOptions) => {
        setPostTo(selectedOptions);
    }

    const handleResponse = (selectedOptions) => {
        setNotifyTo(selectedOptions);
    }

    const setContent = (content) => {
        setBody(content);
    }

    let userOptions, channelOptions, mentions = [];

    if(users.length > 0)
    {
        let item = [];
        users.forEach((user) => {
            if(user.uid !== auth.currentUser.uid)
            {
                item.push({label : user.name, value : user.uid});
                mentions.push({name: user.name, avatar: user.image, link: user.uid});
            }
        });
        userOptions= item;
    }

    if(channels.length > 0)
    {
        let item = [];
        channels.forEach((channel) => {
            item.push({label : channel.channelName, value : channel.id});
        });
        channelOptions= item;
    }    

    return (
        <div>
            {mentions.length > 0 &&
                <Modal
                show={props.compose}
                size="lg"
                onHide={() => {props.setCompose(false)}}
                aria-labelledby="example-custom-modal-styling-title"
                modal-90w
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            New Thread
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">To</label>
                                <Select options={channelOptions} isMulti = {true} onChange = {handleTo} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Request response</label>
                                <Select options={userOptions} isMulti = {true} onChange = {handleResponse} defaultValue = {selectedValue} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input type="text" value = {subject} className="form-control" onChange = {handleSubject}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Body</label>                         
                                    <TextInput setContent = {setContent} addMentionedUsers = {addMentionedUsers} mentions = {mentions} doubleAtMention = {doubleAtMention} />
                            </div>
                            <div className="mb-3">
                                <button type='submit' className='btn btn-dark' onClick = {handlePost}>Post</button>                        
                            </div>
                        </form>
                        
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
}

export default Compose;
