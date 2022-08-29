import React, { useState , useEffect } from "react"
import { Row , Container , Col} from 'react-bootstrap';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Nav from '../nav/index';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
const { faker } = require('@faker-js/faker');

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.css'

export default function Dashboard() {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
    
    const [urlName, setUrlName] = useState('Test');
    const [urlCount, setUrlCount] = useState('0');
    const [urlOld, setUrlOld] = useState('https://google.com');

    const [labels, setLabels] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const [graphData, setGraphData] = useState(labels.map(() => faker.datatype.number({ min: 0, max: 1000 })));
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: '',
        }
      },
    };
    console.log()
    const data = {
      labels,
      datasets: [
        {
          label: 'Url : '+urlOld,
          data: graphData,
          backgroundColor: '#ee6123',
        }
      ],
    };
    
    const [urlState, setUrlState] = useState(1);
    const [myUrl, setMyUrl] = useState([]);
    const navigate = useNavigate();
    const token =  localStorage.getItem("userToken");

    useEffect(() => {
        axios.post('http://localhost/server/index.php/auth/dashboard', 
        {
          token: token,
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
            setMyUrl(response.data.url);
            setUrlName(response.data.url[0].short_link)
            setUrlCount(response.data.url[0].count)
            setUrlOld(response.data.url[0].orginal_link)
            let graph = response.data.graph;
            let days = [];
            let values = [];
            for(let i=0;i<graph.length;i++)
            {
              const myArray = graph[i].time.split(" ");
              days.push(myArray[0]);
              values.push(graph[i].count)
            }
            setLabels(days)
            setGraphData(values)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }, [urlState]);

    const addUrl = (param) => {
      setUrlState(param)
      toast('New Url Added !', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    const changeLink = (e) => {
      axios.post('http://localhost/server/index.php/auth/get_url', 
      {
        token: token,
        url : e.target.value
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
          setUrlName(response.data.url[0].short_link)
          setUrlCount(response.data.url[0].count)
          setUrlOld(response.data.url[0].orginal_link)
          let graph = response.data.graph;
          let days = [];
          let values = [];
          for(let i=0;i<graph.length;i++)
          {
            const myArray = graph[i].time.split(" ");
            days.push(myArray[0]);
            values.push(graph[i].count)
          }
          setLabels(days)
          setGraphData(values)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    return (
        <Container className="fullWidth">
            <Nav url={urlState} func={addUrl}/>
            <Row className="row">
              <Bar options={options} data={data} height={20} width={50} options={{ maintainAspectRatio: false }} />
            </Row>
            <Row className="row">
              <Col className="authBoxText">
                <h5 className="mylink">My Links : </h5>
                <select className="dropdownI" onChange={e => changeLink(e)}>
                  {myUrl.map(item =>
                    <option  key={item.id} value={item.id}>{item.short_link}</option>
                  )} 
                </select>
                <div className="urlBoxInfo">
                    <p>Total Link Clicked : {urlCount}</p>
                    <p>Short Link : {urlName}</p>
                  </div>
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