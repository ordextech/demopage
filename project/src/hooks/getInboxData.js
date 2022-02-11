import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import { db } from "../services/firebase";

const getNotificationCount = async(userId) => {

    try
    {
        const orgCollectionRef = collection(db, "inbox");
        const queryConstraints = [];
        queryConstraints.push(where("isDone", "==", false));
        queryConstraints.push(where("audienceId", "==", userId));
        const q = query(orgCollectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);
        const notificationCount = await querySnapshot.size;
        return notificationCount;
    }
    catch(error)
    {
        console.log(error);
    }
}

export const addToInbox = async(inboxData) => {
    const preferenceCollectionRef = collection(db, "preferences");
    const q = query(preferenceCollectionRef, where("channelId", "==", inboxData.channelId));
    const querySnapshot = await getDocs(q);
    let channelPreference = [];
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            channelPreference.push(doc.data())
        }); 
    }
    if(channelPreference.length > 0)
    {
        let onlyInvolved, onlyMentioned, allNotifications;
        let audience = [];
        onlyInvolved = channelPreference[0].onlyInvolved.split();
        onlyMentioned = channelPreference[0].onlyMentioned.split();
        allNotifications = channelPreference[0].allNotifications.split();
        /*To be implemented....*/
    }
    else {
        console.log("Something went wrong");
    }
}

export const getOrgUsers = async(orgDomain) => {
    const orgCollectionRef = collection(db, "organizations");
    const q = query(orgCollectionRef, where("domain", "==", orgDomain));
    const querySnapshot = await getDocs(q);
    let data;
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            data = doc.data();
        }); 
    }
    return data.users;
}

export const getUserList = async(orgDomain) => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("organizationDomain", "==", orgDomain));
    const querySnapshot = await getDocs(q);
    let data;
    let users = [];
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            data = doc.data();
            users.push(data);
        }); 
    }
    return users;
}

export default getNotificationCount;