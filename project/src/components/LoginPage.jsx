import {db} from "../services/firebase";
import {addDoc, collection, getDocs, where,  query, updateDoc, doc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

function LoginPage({setIsUserSignedIn})
{
    let navigate = useNavigate();
    const loginAuth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    
    const addUser = async(userId, email, userData) => {
        if((userId !== undefined || userId !== "") && (email !== undefined || email !== ""))
        {
            const usersCollectionRef = collection(db, "users");
            const orgCollectionRef = collection(db, "organizations");
            const organizationDomain = email.split("@")[1];

            await addDoc(usersCollectionRef, {
                name : userData.name,
                uid : userId,
                image : userData.url,
                organizationDomain : organizationDomain
            });

            const q = query(orgCollectionRef, where("domain", "==", organizationDomain));
            const querySnapshot = await getDocs(q);
            let data, id;
            if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    data = doc.data();
                    id = doc.id
                }); 
                try{
                    await updateDoc(doc(db, "organizations", id), {users : data.users + "," + userId})
                }
                catch(error)
                {
                    console.log(error);
                }
            } else {
                await addDoc(orgCollectionRef, {
                    domain : organizationDomain,
                    users : userId
                });
            }
        }
        
    }

    const signInWithGoogle = () => {
        loginAuth.signInWithPopup(googleProvider).then(async(res) => {
            //Add New user to Team
            if(res.additionalUserInfo.isNewUser)
            {
                try {
                    let userData = {name : res.user.displayName, url : res.user.photoURL}
                    addUser(res.user.uid, res.user.email, userData);
                } 
                catch (error) {
                    console.log(error);
                }
            }
            localStorage.setItem("isUserSignedIn",true);
            localStorage.setItem("email",res.user.email);
            localStorage.setItem("username", res.user.displayName);
            localStorage.setItem("userId", res.user.uid);
            navigate("/");
        }).catch((error) => {
            console.log(error.message)
        });
    }
    
    // const signInWithGoogle = () => {
    //     signInWithPopup(auth, provider).then((result) => {
    //         localStorage.setItem("isUserSignedIn",true);
    //         localStorage.setItem("email",result.user.email);
    //         localStorage.setItem("username", result.user.displayName);
    //         console.log(result.additionalUserInfo);
    //         setIsUserSignedIn(true);
    //         navigate("/");
    //     });
    // };



    return(
        <div className="loginPage text-center">
            <p>Sign In With Google to Continue</p>
            <button className="btn btn-log" onClick={signInWithGoogle}>
                <i className="fab fa-google me-2"></i> Sign in with google
            </button>
        </div>
    );
}
export default LoginPage;