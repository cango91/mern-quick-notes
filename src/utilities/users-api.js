import { sendRequest } from "./utils";
const BASE_URL = '/api/users';

export async function login(userData){
    try {
        return await sendRequest(`${BASE_URL}/login`,'POST',userData);
    } catch (error) {
        throw new Error('Invalid login');
    }  
}

export async function logout(){
    try {
        return await sendRequest(`${BASE_URL}/logout`,'POST');
    } catch (error) {
        throw new Error('Logout unsuccessful');
    }  
}

// export async function refreshToken(){
//     try {
//         return await sendRequest(`${BASE_URL}/refresh`,'POST');
//     } catch (error) {
//         throw new Error('Refresh token unsuccessful. Login again.');
//     }  
// }

export async function signup(userData){
    try {
        return await sendRequest(BASE_URL,'POST',userData);
    } catch (error) {
        throw new Error('Invalid signup');
    }  
}