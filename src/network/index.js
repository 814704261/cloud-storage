import axios from 'axios'

let instance = axios.create({
    baseURL: 'https://localhost:1234',
    timeout: 3000,
});


export function http(url, config) {
    return instance.get(url, config)
}