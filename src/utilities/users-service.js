import * as api from './users-api';
import { parseJwt } from './utils';

export function setAccessToken(token) {
    localStorage.setItem('token', token);
}

export function getAccessToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
}

export function getUser() {
    const token = getAccessToken();
    return token ? parseJwt(token).user : null;
}

export async function signup(userData) {
    const json = await api.signup(userData);
    console.log(json);
    setAccessToken(json.accessToken);
    return getUser();
}

export async function logout() {
    try {
        await api.logout();
    } catch (error) {
        console.error('Could\'t logout:', error);
    }
    localStorage.removeItem('token');
}

export async function login(data) {
    const json = await api.login(data);
    setAccessToken(json.accessToken);
    return getUser();
}