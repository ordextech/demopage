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
    const inboxRef = collection(db, "inbox");
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
        onlyInvolved = channelPreference[0].onlyInvolved  !== null ? channelPreference[0].onlyInvolved.split(",") : "";
        onlyMentioned = channelPreference[0].onlyMentioned !== null ? channelPreference[0].onlyMentioned.split(",") : "";
        allNotifications = channelPreference[0].allNotifications !== null ? channelPreference[0].allNotifications.split(",") : "";

        //Add Data related to user who wants all notifications
        if(allNotifications.length > 0)
        {   
            allNotifications.forEach((userId) => {
                audience.push(userId)
            })
        }

        //When User gets reply on the comment, mentioned by other users in comment or get comments on own post....
        /*if(onlyInvolved.length > 0 && inboxData.mentioned)
        {
            let involvedUsers = inboxData.mentioned.split();
            onlyInvolved.forEach((userId) => {
                if (involvedUsers.includes(userId))
                {
                    audience.push(userId)
                }
            })
        }*/

        //When user is mentioned by another users using single "@" mention
        if(onlyMentioned.length > 0 && inboxData.mentioned)
        {
            let mentionedusers = inboxData.mentioned.split();
            onlyMentioned.forEach((id) => {
                if (mentionedusers.includes(id))
                {
                    audience.push(id)
                }
            })
        }

        if(inboxData.response)
        {
            let responseRequired = inboxData.response.split();
            responseRequired.forEach((id) => {
                audience.push(id);
            })
        }

        //Send Inbox messages...
        audience.forEach(async (user) => {
            if(user !== inboxData.authorId)
            {
                try {
                    await addDoc(inboxRef, {
                        authorId : inboxData.authorId,
                        authorName : inboxData.authorName,
                        channelId : inboxData.channelId,
                        channelName : inboxData.channelName,
                        relationId : inboxData.sourceId,
                        relationType : inboxData.relationType,
                        audienceId : user,
                        isDone : false,
                        mentioned : inboxData.mentioned ?? "",
                        response : inboxData.response ?? "",
                        addedOn : +new Date()
                    });
                }
                catch(error)
                {
                    console.log(error);
                }
            }
        });

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