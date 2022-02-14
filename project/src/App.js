import './App.css';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import HomePage from './components/HomePage';
import Inbox from './components/Inbox';
import LoginPage from './components/LoginPage';
import ViewPost from './components/ViewPost';
import { auth } from './services/firebase';
import { signOut } from "firebase/auth";
import logo from "./img/nav-logo.png";
import CreatePost from './components/CreatePost';

function App() 
{
  const [isUserSignedIn, setIsUserSignedIn] = useState(localStorage.getItem("isUserSignedIn"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsUserSignedIn(false);
      window.location.pathname = "/login";
    });
  };
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage isUserSignedIn={isUserSignedIn}/>}/> */}
        <Route path="/" element={<Inbox isUserSignedIn={isUserSignedIn}/>}/>
        <Route path="/createpost" element={<CreatePost isUserSignedIn={isUserSignedIn}/>}/>
        <Route path="/viewpost" element={<ViewPost postId/>}/>
        <Route path="/login" element={<LoginPage setIsUserSignedIn={setIsUserSignedIn}/>}/>
      </Routes>
    </Router>
  );
}

export default App;