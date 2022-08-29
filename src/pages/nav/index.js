import React, { useState } from "react"
import { Container ,Navbar , Button , NavDropdown , Modal , Col , Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isObjEmpty } from "../../assets/utility/until";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.css'

export default function Nav(params) {
    const [formState, setFormState] = useState({
      url: "",
    });
    const [urlState, setUrlState] = useState(params.url);
    const SignInSchema = yup.object().shape({
      url: yup.string().required(" Url is a required field.").min(10),
    });

    const { register, handleSubmit , formState: { errors } } = useForm({
      mode: "onSubmit",
      resolver: yupResolver(SignInSchema),
    });

    const addUrl = params.func;

    const onSubmit = async () => {
      let token =  localStorage.getItem("userToken");
      axios.post('http://localhost/server/index.php/auth/add_link', 
      {
        token: token,
        url : formState.url
      }, {
        headers: { 
          'Accept': 'application/json',
          "Content-Type": "application/x-www-form-urlencoded"
      }})
      .then(function (response) {
        console.log(response)
        if(response.data.result == 0)
        {
          localStorage.removeItem("userToken");
          navigate("/");
        }
        else
        {
          let urlNo = urlState + 1;
          setUrlState(urlNo);
          addUrl(urlNo);
          handleClose();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <Navbar bg="dark" variant="dark">
            <Container className="fullWidth">
                <Navbar.Brand href="#home" className="logoContainer">
                    <img
                    alt=""
                    src="data:image/png;base64,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"
                    width="50"
                    height="30"
                    className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className="linkBtnContainer">
                    <Button variant="primary" type="submit" className='AddLinkBtn' onClick={handleShow}>
                        Create
                    </Button>
                </Navbar.Text>
                <Navbar.Text className="LoginInfo">
                    Signed as: <a href="#login">Bitly</a>
                    <NavDropdown title="" id="navbarScrollingDropdown" className="DropDownUser">
                        <NavDropdown.Item href="#action3" className="BlackColor">My Links</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5" className="BlackColor">
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="formText">URL</Form.Label>
                <input 
                  autoFocus
                  name="url"
                  id="url"
                  className={classnames({ "is-invalid": errors["url"] } , 'form-control') }
                  {...register('url')} 
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                {errors.url?.message && <p className="error">{errors.url?.message}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" claasName="btnCreate">
              Create
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
  }