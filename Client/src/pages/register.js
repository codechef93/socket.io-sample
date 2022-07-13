import { useState, useContext, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import styled from "styled-components";
import validator from 'validator'
import io from "socket.io-client";
import { Button } from "../components/Button";
import { StateContext, DispatchContext } from "../context/GlobalContext";
import {
    USER_REGSITER_FAIL,
    USER_REGSITER_SUCCESS,
    USER_REGSITER_REQUEST,
} from "../context/constants/userConstants";
import { ENDPOINT } from "../context/constants/socketConstants";
import axios from "axios";
import Loading from "../components/Loading";

const socket = io(ENDPOINT);
const FormContainer = styled.div`
  margin-top: 60px;
  padding: 2rem calc((100vw - 1300px) / 2);
`;
const Alert = styled.div`
  color: red;
  margin-top: 1rem;
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
const Select = styled.select`
  display: block;
  width: 90%;
  /* margin-left: 1.5rem; */
  margin-bottom: 1.5rem;
  padding: 0.3rem 0.7rem;
  line-height: 1.5rem;
  border: 1px solid ${({ theme }) => theme.primaryText};
  border-radius: 0.25rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
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

function Login({ history, location }) {
    const state = useContext(StateContext);
    const { user } = state;
    const dispatch = useContext(DispatchContext);
    const fromPath = useRef(location.state ? location.state.from.pathname : "/");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState("Realtor");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        // e.preventDefault();
        //form validation
        console.log("validation", validator.isEmpty(name));
        if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
            setError("Please fill the input filed")
            return;
        } if (!validator.isEmail(email)) {
            setError("Invalid email type")
            return;
        } if (!validator.isStrongPassword(password, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            console.log("pss", password)
            setError('Please ensure strong password.')
            return;
        } if (password !== confirmPassword) {
            console.log("pss", password)
            console.log("confpss", confirmPassword)
            setError("Passwords do not match");
            return;
        }
        //user registration
        dispatch({ type: USER_REGSITER_REQUEST });
        try {
            socket.emit("REGISTER", { name, email, userType, password });
            socket.on("success", (msg) => {
                // alert(msg);
                dispatch({
                    type: USER_REGSITER_SUCCESS,
                    payload: {},
                });
                history.push({
                    pathname: "/login",
                    state: { message: "Registration successful, please login to continue" },
                });
            });
            socket.on("error", (msg) => alert(msg));

        } catch (e) {
            alert("catch");
            dispatch({ type: USER_REGSITER_FAIL, payload: e.response });
            setError(e.response?.data?.message);
        }
    };

    useEffect(() => {
        if (user && user.auth) {
            history.push(fromPath.current);
        }
    }, [history, user]);

    return (
        <Layout hideFooter="true" hideNav="false">
            {user.loading ? (
                <Loading />
            ) : (
                <FormContainer>
                    <Form>
                        <h2>Register</h2>
                        {error && <Alert>{error}</Alert>}
                        <InputGroup>
                            Name:
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            Email:
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            User-Type:
                            <Select
                                name="userType"
                                value={userType}
                                onChange={(e) => { setUserType(e.target.value); console.log(userType) }}
                            >
                                <option value="Realtor">Realtor</option>
                                <option value="Customer">Customer</option>
                            </Select>
                        </InputGroup>
                        <InputGroup>
                            Password:
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            Confirm Password:
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </InputGroup>
                        <ButtonContainer>
                            <Button to="#" onClick={handleSubmit}>Register</Button>
                            <Button to="#" onClick={history.goBack}>
                                Cancel
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            )}
        </Layout>
    );
}

export default Login;
