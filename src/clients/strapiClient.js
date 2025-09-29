import axios from 'axios';

export function createStrapi() {
	const baseURL = process.env.STRAPI_URL;
	const token = process.env.STRAPI_TOKEN;
	const client = axios.create({ baseURL, headers: token ? { Authorization: `Bearer ${token}` } : {} });
	return client;
}


