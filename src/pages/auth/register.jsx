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
    name : '',
    password : ''
  });

  const navigate = useNavigate();

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field.")
      .email("Email must be a valid email."),
    name: yup.string().required(" Name is a required field.").min(6),
    password: yup.string().required("Password is a required field.").min(6)
  });

  const { register, handleSubmit , formState: { errors } } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      axios.post('http://localhost/server/index.php/auth/index', 
      {
        name: formState.name,
        password: formState.password,
        email : formState.email
      }, {
        headers: { 
          'Accept': 'application/json',
          "Content-Type": "application/x-www-form-urlencoded"
      }})
    .then(function (response) {
      if(response.data.result == 0)
      {
        toast('Email is registered before! Try another one', {
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
        toast('You registeration has been successully.', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/");
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
                    <h3>Already have an account? <a href="/">Log in</a></h3>
                </Col>
            </Row>
            <Row>
                <Col className="authBox">
                <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label className="formText">Name</Form.Label>
                            <input 
                              autoFocus
                              name="name"
                              id="name"
                              className={classnames({ "is-invalid": errors["name"] } , 'form-control') }
                              {...register('name')} 
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  [e.target.name]: e.target.value,
                                })
                              }
                            />
                            {errors.name?.message && <p className="error">{errors.name?.message}</p>}
                        </Form.Group>

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