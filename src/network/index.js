import axios from 'axios'

let instance = axios.create({
    baseURL: 'http://localhost:1234/',
    timeout: 5000,
});


export default instance