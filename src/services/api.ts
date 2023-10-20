import axios from 'axios'

const api = axios.create({
    baseURL:'http://192.168.43.178:5050/'
})

export default api