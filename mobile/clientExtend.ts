import { client } from "./api/client";
import * as SecureStore from "expo-secure-store";

client.interceptors.request.use(async (request) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    console.log("Token: ", token);
    request.headers.set('Authorization', token);
  }
  return request;
});

client.setConfig({
  baseUrl: "https://hsekey.lxft.tech"
});

console.log("Client baseUrl: ", client.getConfig().baseUrl);
