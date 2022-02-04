import React, {useState} from 'react';
import {addDoc, collection} from "firebase/firestore";
import { auth, db } from "../services/firebase";

function CreateChannel(props) {

    const [showForm, setShowForm] = useState(false);
    const [channelName, setChannelName] = useState("");
    const domain = localStorage.getItem('email').split('@')[1];
    const author = localStorage.getItem('username');

    const createChannel = async(e) => {
        e.preventDefault();
        if(channelName.trim() == "")
        {
            alert("Please Enter the channel name");
        }
        else {
            const channelCollection = collection(db, "channels");
            const newChannel = await addDoc(channelCollection, {
                channelAuthor : author,
                channelDomain : domain,
                channelName : channelName
            });
            props.addNewChannel({id : newChannel.id, channelName : channelName});
            setChannelName("");
            setShowForm(false);
        }
        
    }

    const handleInput = (e) => {
        setChannelName(e.target.value);
    }

    return (
        <div className='container'>
            <div className="btn btn-dark" onClick={() => {setShowForm(true)}}>
                Create New Channel
            </div>
            {showForm &&
                <div className='my-2'>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="channelName" className="form-label">Channel Name</label>
                            <input type="text" className="form-control" id="channelName" name = "channelName" value={channelName} onChange={handleInput} />
                        </div>
                        <button type="submit" className="btn btn-dark" onClick={createChannel}>Create</button>
                    </form>
                </div>
            }
        </div>
    );
}

export default CreateChannel;
