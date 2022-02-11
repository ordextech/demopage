import React, {useState, useEffect} from 'react';
import addButton from '../img/plusIcon.png';
import CreateChannel from './modals/CreateChannel';
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import {auth, db} from "./../services/firebase"

function Channels(props) {
    
    const [showModal, setShowModal] = useState(false);
    const [orgMembers, setOrgMembers] = useState([]);

    const email = auth && auth.currentUser ? auth.currentUser.email : "";

    const getUsers = async() => {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("organizationDomain", "==", email.split("@")[1]));
        const querySnapshot = await getDocs(q);
        //let data = {id : "", userInfo : ""};
        let items = [];
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                // data.id = doc.id
                // data.userInfo = doc.data();
                items.push({id: doc.id, userInfo : doc.data()});
            }); 
        }
        setOrgMembers(items);
        console.log(items);
    }

    useEffect(() => {
        getUsers();
    }, [])
    

    const selectedPostStyle = {
        textAlign: 'center',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: 'black'
    };

    return (
        <div className="col-md-3" style={{borderRight  : "2px solid black"}}>
            <div className = "my-3 fw-bold text-center">Hello, {auth.currentUser && auth.currentUser.displayName ? auth.currentUser.displayName : ""}</div>
            <span className="my-3 text-center"><h3>{props.inbox ? "" : "My Channels"}</h3></span>
            {props.inbox ? 
                <div className = 'd-flex  justify-content-between my-3'>
                    <div className={props.selectedChannel && props.selectedChannel.length !== 0 ? "text-center" :"fw-bold text-center"} style={{cursor : "pointer" }} onClick={() => {props.viewInbox()}}>
                        Inbox - {props.inboxCount}
                    </div>
                </div>
                :
                ""
            }
            <div className='d-flex  justify-content-between my-3'>
                <span className = "fw-bold text-center">Forums</span>
                <img src = {addButton} alt = "Create Forum" style={{cursor : "pointer"}} onClick = {() => {setShowModal(true)}}/>
            </div>
            {props.channels.map((item) => {
                return (
                    <div className="my-2" style={item.id === props.selectedChannel.id ? selectedPostStyle : {textAlign : "center", cursor : "pointer" }} onClick={() => {props.viewPosts(item)}}>
                        {item.channelName}
                    </div>
                );
            })}
            { orgMembers && showModal &&
                <CreateChannel showModal = {showModal} setShowModal = {setShowModal} orgMembers = {orgMembers}/>
            }
        </div>
    );
}

export default Channels;
