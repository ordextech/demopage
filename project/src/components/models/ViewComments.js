import { useEffect, useState } from "react";
import { getDocs,collection} from "firebase/firestore";
import { db } from "../components/firebase";


function ViewComments({postId,onHide})
{
    const [commentList, setCommentList] = useState([]);
    const commentCollectionRef = collection(db,"comments");

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(commentCollectionRef);
            console.log(data);
            console.log(data.docs.map((doc) => ({
                ...doc.data(), id:doc.id
            })));
            setCommentList(data.docs.map((doc) => ({
                ...doc.data(), id:doc.id
            })));
        };
        getPosts();
    },[]);

    return(
        <div className="viewContainer">
        {commentList.map((c) => {
            return (
                c.postId===postId ? (
                    <div className="post">
                            <div className="postTextContainer">
                                {c.comment}
                            </div>
                            <div className="title">
                                <h6>@{c.authorName}</h6>
                            </div>   
                    </div>
                ) : ""
            );
        })}
        </div>
    );
}

export default ViewComments;