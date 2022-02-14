import { selectOptions } from '@testing-library/user-event/dist/select-options';
import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import {auth, db} from "../../services/firebase"

function CreateChannel(props) {

    console.log(props);
    const [forumName, setForumName] = useState("");
    const [forumDescription, setForumDescription] = useState("");
    const [privateForum, setPrivateForum] = useState("");
    const [showMembers, setShowMembers] = useState(false);
    const [customMembers, setCustomMembers] = useState([]);
    const [allMembers, setAllMembers] = useState();

    const handleCreate = async(e) => {
        e.preventDefault();
        if(forumName.trim() === "")
        {
            alert('Please enter name of the forum');
        }
        else if(forumDescription.trim() === "")
        {
            alert('Please enter description of forum');
        }
        else if(allMembers === undefined || (allMembers === false && customMembers.length === 0))
        {
            alert('Please select valid audience for forum');
        }
        else if(privateForum === "")
        {
            alert('Please select visibility of forum (Public/Private)');
        }
        else {

            const author = auth.currentUser.displayName;
            const authorId = auth.currentUser.uid;
            const domain = auth.currentUser.email.split("@")[1];
            const channelCollection = collection(db, "channels");

            const newChannel = await addDoc(channelCollection, {
                channelAuthor : author,
                channelDomain : domain,
                channelName : forumName,
                createdOn : + new Date(),
                privateForum : privateForum
            });

            let audience = [authorId];

            if(customMembers.length > 0)
            {
                customMembers.forEach((member) => {
                    audience.push(member.value)
                })
            }
            else {
                props.orgMembers.forEach((member) => {
                    if(member.userInfo.uid !== authorId)
                        audience.push(member.userInfo.uid);
                })
            }
            
            props.orgMembers.forEach(async (member) => {
                if(audience.includes(member.userInfo.uid))
                {
                    //Adding a new channel to user collection
                    let addChannel;

                    if(member.userInfo.channels)
                    {
                        addChannel =  member.userInfo.channels + ", " + newChannel.id;
                    }
                    else {
                        addChannel = newChannel.id
                    }
        
                    try{
                        await updateDoc(doc(db, "users", member.id), {channels : addChannel})
                    }  
                    catch(error)
                    {
                        console.log(error)
                    }
                }
            });


            //Set Default Preference for channel members 
            const preferencesCollectionRef = collection(db, "preferences");
            try{
                await addDoc(preferencesCollectionRef, {
                    channelId : newChannel.id,
                    onlyMentioned : audience.join(),
                    onlyInvolved : null,
                    allNotifications : null,
                    createdOn : + new Date()
                });
            }
            catch(error)
            {
                console.log(error);
            }

            props.getUsers()
            props.setShowModal(false);
        }
    }

    const addCustomMembers = (selectOptions) => {
        setCustomMembers(selectOptions);
    }

    const handlePrivacy = (e) => {
        setPrivateForum(e.target.value);
    }

    const handleMembers = (e) => {
        if(e.target.value === "1")
        {
            setAllMembers(false);
            setShowMembers(true);
        }
        else 
        {
            setAllMembers(true);
            setShowMembers(false);
        }
    }

    let members = [];

    props.orgMembers.forEach((member) => {
        if(member.userInfo.uid !== auth.currentUser.uid)
            members.push({label : member.userInfo.name, value : member.userInfo.uid});
    })

    return (
        <div>
            <Modal
                show={props.showModal}
                size="lg"
                onHide={() => {props.setShowModal(false)}}
                aria-labelledby="example-custom-modal-styling-title"
                modal-90w
                >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Create a new forum
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Forum name</label>
                            <input name = "forumName" type="text" value = {forumName} className="form-control" onChange = {(e) => {setForumName(e.target.value)}}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Forum Description</label>
                            <input name = "forumDescription" type="text" value = {forumDescription} className="form-control" onChange = {(e) => {setForumDescription(e.target.value)}}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Add Members</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="members" id="allMembers" onChange={handleMembers} value = {0}/>
                                <label className="form-check-label">
                                    Add All members of Organization ({props.orgMembers.length})
                                </label>
                                </div>
                                <div className="form-check">
                                <input className="form-check-input" type="radio" name="members" id="selectedMembers" onChange={handleMembers} value = {1} />
                                <label className="form-check-label">
                                    Choose People to add
                                </label>
                                {showMembers &&
                                    <div className = 'my-2'>
                                        <Select options={members} isMulti = {true} onChange = {() => {}} onChange = {addCustomMembers}/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Privacy</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="forumPrivacy" id="publicForum" onChange={handlePrivacy} value = {false} />
                                <label className="form-check-label">
                                    Public
                                </label>
                                </div>
                                <div className="form-check">
                                <input className="form-check-input" type="radio" name="forumPrivacy" id="privateForum" onChange={handlePrivacy} value = {true} />
                                <label className="form-check-label">
                                    Private
                                </label>
                            </div>
                        </div>
                        <div className="text-end">
                            <button type='reset' className='btn btn-dark me-3' onClick = {() => {props.setShowModal(false)}}>Cancel</button>
                            <button type='submit' className='btn btn-dark' onClick = {handleCreate}>Create Forum</button>                        
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
  )
}

export default CreateChannel