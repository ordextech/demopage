import './App.css';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import HomePage from './components/HomePage';
import CreatePost from './components/CreatePost';
import LoginPage from './components/LoginPage';
import ViewPost from './components/ViewPost';
import { auth } from './services/firebase';
import { signOut } from "firebase/auth";
import logo from "./img/nav-logo.png";

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
      <nav className="navbar navbar-expand-md shadow mb-5">
        <div className="container-md">
            <div className="navbar-brand col-2"><img src={logo} alt={'logo'} className='img-fluid' /></div>

            <button className="navbar-toggler bg-light navbar-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav align-items-center">
              <li>
                    <Link className="nav-link active" to="/">Home</Link>
              </li>
              { !isUserSignedIn ? (
                <li>
                <Link to="/login" className="nav-link">
                  <button className='btn btn-log'>
                  <i className="fas fa-sign-in-alt me-2"></i>Login</button>
                </Link>
                </li>
              ) : (
                <>
                  
                  <li>
                    <Link to="/createpost" className="nav-link">Inbox(0)</Link>
                  </li>
                  <li><button className='btn btn-log' onClick={signUserOut}>
                  <i className="fas fa-sign-out-alt me-2"></i>Log Out</button></li>
                </>
              )}
            </ul>
            </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage isUserSignedIn={isUserSignedIn}/>}/>
        <Route path="/createpost" element={<CreatePost isUserSignedIn={isUserSignedIn}/>}/>
        <Route path="/viewpost" element={<ViewPost postId/>}/>
        <Route path="/login" element={<LoginPage setIsUserSignedIn={setIsUserSignedIn}/>}/>
      </Routes>
    </Router>
  );
}

export default App;