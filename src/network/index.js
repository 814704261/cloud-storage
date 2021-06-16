import axios from 'axios'

let instance = axios.create({
    baseURL: 'http://localhost:1234/'
});


export default instance