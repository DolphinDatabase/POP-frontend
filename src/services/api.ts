import axios from 'axios'

const api = axios.create({
    // Change to http://localhost:5050/ if you're running out of a k8s cluster
    baseURL:'http://192.168.43.178:5050/'
})

export default api