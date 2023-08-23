import axios from "axios";

const API = axios.create({
  baseURL : process.env.REACT_APP_SERVER_URL,
  withCredentials : true
})

export async function makeRequest(url, options) {
  return await API(url, options)
    .then((res) => res.data)
    .catch(
      (error) =>
        Promise.reject(error?.response?.data?.message) ??
        error.message ?? "Error"
    );
}
