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
    const orgCollectionRef = collection(db, "organizations");
    const inboxRef = collection(db, "inbox");
    const q = query(orgCollectionRef, where("domain", "==", inboxData.organizationDomain));
    const querySnapshot = await getDocs(q);
    let data;
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            data = doc.data();
        }); 
    }
    const audience = data.users.split(",");
 
    audience.forEach(async (user) => {
        if(user !== inboxData.authorId)
        {
            console.log(inboxData);
            await addDoc(inboxRef, {
                authorId : inboxData.authorId,
                authorName : inboxData.authorName,
                channelId : inboxData.channelId,
                channelName : inboxData.channelName,
                relationId : inboxData.sourceId,
                relationType : inboxData.relationType,
                audienceId : user,
                isDone : false,
                mentioned : inboxData.mentionedUsers,
                response : inboxData.attentionRequire
            });
        }
    });
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