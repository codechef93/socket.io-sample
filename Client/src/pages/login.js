import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";
import styled from "styled-components";
import { Button } from "../components/Button";
import io from "socket.io-client";
import { StateContext, DispatchContext } from "../context/GlobalContext";
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
} from "../context/constants/userConstants";
import { ENDPOINT } from "../context/constants/socketConstants";
import axios from "axios";
import Loading from "../components/Loading";

const socket = io(ENDPOINT);
const FormContainer = styled.div`
  margin-top: 60px;
  padding: 2rem calc((100vw - 1300px) / 2);
`;
const Form = styled.form`
  width: 40%;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 0 4px ${({ theme }) => theme.primaryText};
  @media screen and (max-width: 768px) {
    width: 90%;
  }
  @media screen and (max-width: 48px) {
    width: 100%;
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.primaryText};
    &:hover {
      text-decoration: underline;
    }
  }
`;
const InputGroup = styled.label`
  margin-top: 1rem;
`;
const Input = styled.input`
  display: block;
  width: 90%;
  /* margin-left: 1.5rem; */
  margin-bottom: 1.5rem;
  padding: 0.3rem 0.7rem;
  line-height: 1.5rem;
  border: 1px solid ${({ theme }) => theme.primaryText};
  border-radius: 0.25rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: text;
  outline: none;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primaryText};
  &:focus {
    background: ${({ theme }) => theme.background};
    box-shadow: 0 0 5px ${({ theme }) => theme.primaryText};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;
const Alert = styled.div`
  color: red;
  margin-top: 1rem;
`;
const Message = styled.div`
  color: green;
  margin-top: 1rem;
`;

function Login({ history, location }) {
    let navigate = useNavigate();
    const state = useContext(StateContext);
    const { user } = state;
    const dispatch = useContext(DispatchContext);
    const fromPath = useRef(location.state?.from ? location.state.from : "/");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        dispatch({ type: USER_LOGIN_REQUEST });
        e.preventDefault();
        try {
            console.log("login email", email);
            socket.emit("LOGIN", { email, password });
            socket.on("success", (data) => {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: { ...data, auth: true } });
                localStorage.setItem("userId", data._id);

            })
            console.log("token")
            socket.on("error", (data) => {
                console.log("error", data);
                dispatch({ type: USER_LOGIN_FAIL, payload: data });
                setError(data);
            })
            console.log("sss");
        } catch (e) {

            dispatch({ type: USER_LOGIN_FAIL, payload: e });
            setError(
                e.response?.data?.message ||
                "Something went wrong please check email/password and try again"
            );
        }
    };
    // const demoLogin = async () => {
    //     dispatch({ type: USER_LOGIN_REQUEST });
    //     try {
    //         const { data } = await axios.post("/api/users/login", {
    //             email: "admin@example.com",
    //             password: "1234",
    //         });
    //         console.log("before dispatch");
    //         dispatch({ type: USER_LOGIN_SUCCESS, payload: { ...data, auth: true } });
    //         //adding token to localstorage
    //         localStorage.setItem("userToken", data.token);
    //     } catch (e) {
    //         dispatch({ type: USER_LOGIN_FAIL, payload: e });
    //         setError(
    //             e.response?.data?.message ||
    //             "Something went wrong please check email/password and try again"
    //         );
    //     }
    // };

    useEffect(() => {
        console.log("effect", user.auth)
        console.log("effect", fromPath.current)
        if (user && user.auth) {
            console.log("redirecting to dashboard")
            // history.push(fromPath.current);
            // return (<Navigate to="/" replace={true} />)
            navigate("/", { replace: true });
        } else console.log("aiejfskdifwef")
    }, [navigate, user]);

    return (
        <Layout hideFooter="true" hideNav="false">
            {user.loading ? (
                <Loading />
            ) : (
                <FormContainer>
                    <Form>
                        <h2>Login</h2>
                        {location.state?.message && (
                            <Message>{location.state?.message}</Message>
                        )}
                        {error && <Alert>{error}</Alert>}
                        <InputGroup>
                            Email:
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            Password:
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>
                        <ButtonContainer>
                            <Button onClick={handleSubmit}>Login</Button>
                            <Button onClick={history.goBack}>Cancel</Button>
                            {/* <Button onClick={demoLogin}>Demo Login</Button> */}
                        </ButtonContainer>
                        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                            <span>
                                forgot password or <Link to="/register">register</Link>
                            </span>
                        </div>
                    </Form>
                </FormContainer>
            )}
        </Layout>
    );
}

export default Login;
