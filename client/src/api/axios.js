import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.unsircle.id'
})


export default instance 
