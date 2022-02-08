import React, {useState} from 'react';
import { auth } from '../services/firebase';

function Channels(props) {
    
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
                <div>
                    <div className={props.selectedChannel && props.selectedChannel.length !== 0 ? "text-center" :"fw-bold text-center"} style={{cursor : "pointer" }} onClick={() => {props.viewInbox()}}>
                        Inbox - {props.inboxCount}
                    </div>
                </div>
                :
                ""
            }
            {props.channels.map((item) => {
                return (
                    <div className="card my-2" style={item.id === props.selectedChannel.id ? selectedPostStyle : {textAlign : "center", cursor : "pointer" }} onClick={() => {props.viewPosts(item)}}>
                        {item.channelName}
                    </div>
                );
            })}
        </div>
    );
}

export default Channels;
