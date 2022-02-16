import React, {useState, useEffect} from 'react';
import "./style.css";
import logo from "../img/ots.jpg";
import CreateChannel from './modals/CreateChannel';
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import {auth, db} from "./../services/firebase";

const Channels = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [orgMembers, setOrgMembers] = useState([]);
    console.log(props)

    const email = auth && auth.currentUser ? auth.currentUser.email : "";
    const orgDomain = email.split("@")[1];

    const getUsers = async() => {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("organizationDomain", "==", orgDomain));
        const querySnapshot = await getDocs(q);
        let items = [];
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                items.push({id: doc.id, userInfo : doc.data()});
            }); 
        }
        setOrgMembers(items);
    }

    const selectChannel = (channel) => {
        props.setSelectedChannel(channel);
    }

    useEffect(() => {
        getUsers();
    }, [])

    return(
        <>
            <div className="container">
                <div className="hstack">
                    <div className="col-2 me-3">
                        <img src={logo} className="img-fluid rounded-pill" />
                    </div>
                    <h2>Ordex</h2>
                </div>

                <div className="my-4">
                    <button className="btn btn-dark rounded-pill">Start a thread</button>
                </div>
                <div className="my-4 hstack inbox" onClick = {() => selectChannel([])}>
                    <p className=  {props.selectedChannel.length > 0 ? "fs-5 me-3 arrow" : "fw-bold fs-5 me-3 arrow"} >Inbox</p>
                    <span className=" badge bg-danger rounded-circle">{props.inboxCount}</span>   
                </div>

                <div className="all_channels">
                    <div className="hstack align mb-2">
                        <h5 className="me-auto">Channels</h5>
                        <p className="fw-bold fs-3">+</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        {props.channels.map((channel) => {
                            let channelSelectedClass;
                            if(channel.id === props.selectedChannel.id)
                            {
                                channelSelectedClass = "list-group-item d-flex justify-content-between align-baseline fw-bold";
                            }
                            else {
                                channelSelectedClass = "list-group-item d-flex justify-content-between align-baseline"
                            }
                            return(
                                <li className = {channelSelectedClass} onClick={() => {selectChannel(channel)}}>
                                    {channel.data.channelName}
                                    {/* <span className="badge bg-secondary">9</span> */}
                                </li>
                            )  
                        })}
                    </ul>
                </div>

            </div>
        </>
    )
};


export default Channels;