import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://52.87.255.171:8800/api/",
  withCredentials: true,
});
