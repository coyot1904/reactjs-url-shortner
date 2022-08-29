import React, { useState } from "react"
import { Row , Container , Col , Form , Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { Input } from 'reactstrap';
import classnames from "classnames";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isObjEmpty } from "../../assets/utility/until";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.css'

export default function Login() {
    const [formState, setFormState] = useState({
        email: "",
        password : ''
    });

    const navigate = useNavigate();

    const SignInSchema = yup.object().shape({
        email: yup
          .string()
          .required("Email is a required field.")
          .email("Email must be a valid email."),
        password: yup.string().required("Password is a required field.").min(6)
    });
    
    const { register, handleSubmit , formState: { errors } } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(SignInSchema),
    });

    const onSubmit = async () => {
        if (isObjEmpty(errors)) {
          axios.post('http://localhost/server/index.php/auth/login', 
          {
            password: formState.password,
            email : formState.email
          }, {
            headers: { 
              'Accept': 'application/json',
              "Content-Type": "application/x-www-form-urlencoded"
          }})
        .then(function (response) {
            console.log(response)
            if(response.data.result == 0)
            {
              toast('Your email or password is not correct', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            else
            {
              toast('Welcome! lets start to shorting', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              localStorage.setItem(
                  "userToken",
                  response.data.token
              );
              navigate("/dashboard");
            }
        })
        .catch(function (error) {
          console.log(error);
        });
      };
    }

    return (
        <Container>
            <Row className="authContainer">
                <Col>
                    <h1 className='headerLogo'>
                        <a href="/" rel="nofollow">Sample Test</a>
                    </h1>
                </Col>
            </Row>
            <Row>
                <Col className="authBoxText">
                    <h4>Sign Up and start shortening</h4>
                    <h3>Don't have an account? <a href="/register">Sign up</a></h3>
                </Col>
            </Row>
            <Row>
                <Col className="authBox">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="formText">Email address</Form.Label>
                            <input 
                              autoFocus
                              name="email"
                              id="email"
                              className={classnames({ "is-invalid": errors["email"] } , 'form-control') }
                              {...register('email')} 
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  [e.target.name]: e.target.value,
                                })
                              }
                            />
                            {errors.email?.message && <p className="error">{errors.email?.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="formText">Password</Form.Label>
                            <input 
                              autoFocus
                              name="password"
                              id="password"
                              type="password"
                              className={classnames({ "is-invalid": errors["password"] } , 'form-control') }
                              {...register('password')} 
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  [e.target.name]: e.target.value,
                                })
                              }
                            />
                            {errors.password?.message && <p className="error">{errors.password?.message}</p>}
                        </Form.Group>
                        <Button variant="primary" type="submit" className='authSubmit'>
                            Log in
                        </Button>
                    </Form>
                </Col>
            </Row>
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        </Container>
    );
  }