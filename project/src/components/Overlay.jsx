import React from "react";
import "./style.css";
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import {auth, db} from "./../services/firebase";

const Overlay = (props) => {

    const changePreference = async (e) => {
        let preference = [];
        const prefCollectionRef = collection(db, "preferences");
        let preferenceQuery = query(prefCollectionRef, where ("channelId", "==", props.channelData.id));
        const querySnapshot = await getDocs(preferenceQuery);
        querySnapshot.forEach((doc) => {
            preference.push({id: doc.id, data : doc.data()})
        });
        let allNotifications = preference[0].data.allNotifications;
        let onlyInvolved = preference[0].data.onlyInvolved;
        let onlyMentioned = preference[0].data.onlyMentioned;

        let currentPreference;

        if(allNotifications)
        {
            currentPreference = allNotifications.split(",");
            currentPreference = currentPreference.filter((userId) => {
                return userId !== props.userData.uid
            });
            allNotifications = currentPreference.join(",");
        }

        if(onlyInvolved)
        {
            currentPreference = onlyInvolved.split(",");
            currentPreference = currentPreference.filter((userId) => {
                return userId !== props.userData.uid
            });
            onlyInvolved = currentPreference.join(",");
        }

        if(onlyMentioned)
        {
            currentPreference = onlyMentioned.split(",");
            currentPreference = currentPreference.filter((userId) => {
                return userId !== props.userData.uid
            });
            onlyMentioned = currentPreference.join(",");
        }

        if(e.target.value === 1)
        {
            allNotifications = (allNotifications ? allNotifications + ',' + props.userData.uid : props.userData.uid);
            await updateDoc(doc(db, "preferences", preference[0].id), {allNotifications, onlyInvolved, onlyMentioned});
        }
        else if(e.target.value === 0)
        {
            onlyMentioned = (onlyMentioned ? onlyMentioned + ',' + props.userData.uid : props.userData.uid);
            await updateDoc(doc(db, "preferences", preference[0].id), {allNotifications, onlyInvolved, onlyMentioned});
        }


    }

    return(
        <>
            <div className="dropdown ">
                <div className="text-end">
                    <button className="btn" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    SUBSCRIBE
                </button>
                </div>
                <ul className="dropdown-menu list-group-flush" aria-labelledby="dropdownMenuButton1">
                        <li className="list-group-item d-flex justify-content-between" value = "1" onClick= {changePreference}>
                            <p className="me-auto align-middle"> Subscribe to all replies </p>
                                {/* <span className="badge bg-secondary">S</span> +
                                <span className="badge bg-secondary">A</span>  */}
                        </li> 
                        <li className="list-group-item d-flex justify-content-between" value = "0" onClick= {changePreference}>
                            <p className="me-auto">Unsubscribe. Mentions only </p>
                                {/* <span className="badge bg-secondary">S</span> +
                                <span className="badge bg-secondary">U</span>         */}
                        </li>
                </ul>
            </div>
        </>
    )
}


export default Overlay;