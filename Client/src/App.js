import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { StateContext, DispatchContext } from "./context/GlobalContext";
import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGIN_FAIL,
} from "./context/constants/userConstants";
import Index from "./pages";
import NotFound from "./pages/404";
import About from "./pages/about";
import Contact from "./pages/contact";
import Homes from "./pages/homes";
import Admin from "./pages/admin";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./components/PrivateRoute";
import axios from "axios";
import io from "socket.io-client";
import User from "./pages/user";
import Addhome from "./pages/addhome";
import { ENDPOINT } from "./context/constants/socketConstants";

function App() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const socket = io(ENDPOINT);

    console.log("inapp", state.user.auth)
    useEffect(() => {
        async function getUserData() {
            const uId = localStorage.getItem("userId");
            // if (uId) {
            //     dispatch({
            //         type: USER_LOGIN_REQUEST,
            //     });
            //     try {
            //         socket.emit("GET_PROFILE", uId);
            //         socket.on("success", (data) => {
            //             dispatch({
            //                 type: USER_LOGIN_SUCCESS,
            //                 payload: { ...data, auth: true },
            //             });
            //         })
            //         socket.on("error", (data) => {
            //             dispatch({ type: USER_LOGIN_FAIL, payload: data });
            //             alert(data);
            //             return <Redirect to = "/login" />;
            //         })
            //     } catch (err) {
            //         dispatch({
            //             type: USER_LOGIN_FAIL,
            //             error: err,
            //         });
            //     }
            // }
        }
        getUserData();
    }, [dispatch, state.user.auth]);

    return (
        <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/homes/:id" component={Homes} />
            <Route path="/homes" component={Homes} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            {/* <PrivateRoute path="/user" component={User} />
      <PrivateRoute path="/admin" component={Admin} />
      <PrivateRoute path="/addhome" component={Addhome} /> */}
            <Route path="/user" component={User} />
            <Route path="/admin" component={Admin} />
            <Route path="/addhome" component={Addhome} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
