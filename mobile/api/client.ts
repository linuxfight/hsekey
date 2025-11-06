import * as SecureStore from 'expo-secure-store';
import { createClient } from './client/client.gen';

export const client = createClient();

client.interceptors.request.use(async (request, options) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    const { baseUrl } = client.getConfig();
    const url = new URL(request.url, baseUrl);
    url.searchParams.append('token', token);
    return new Request(url.toString(), request);
  }
  return request;
});
