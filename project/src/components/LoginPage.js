import {auth,provider} from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginPage({setIsUserSignedIn})
{
    let navigate = useNavigate();
    
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isUserSignedIn",true);
            localStorage.setItem("email",result.user.email);
            setIsUserSignedIn(true);
            navigate("/");
        });
    };

    return(
        <div className="loginPage text-center">
            <p>Sign In With Google to Continue</p>
            <button className="btn btn-log" onClick={signInWithGoogle}>
                <i class="fab fa-google me-2"></i> Sign in with google
            </button>
        </div>
    );
}
export default LoginPage;