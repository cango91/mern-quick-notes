import { getAccessToken, setAccessToken } from "./users-service";
export async function sendRequest(url, method = "GET", payload = null) {
    const options = { method };
    if (payload) {
        options.headers = { 'Content-type': 'application/json' };
        options.body = JSON.stringify(payload);
    }


    const token = getAccessToken();
    if (token) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, options);
    if (res.ok) {
        const newAccessToken = res.headers.get('New-Access-Token');
        if (newAccessToken) {
            setAccessToken(newAccessToken);
        }
        return res.json();
    }else{
        // check if refresh token expired
        if(res.status === 401 && token){
            try{
                const response = await fetch('/api/users/refresh',{
                    method:'POST',
                    headers: {'Content-type':'application/json'}
                });
                const json = await response.json();
                if(json.message && json.message.toLowerCase() !== 'ok'){
                    await fetch('/api/users/logout',{method:'POST'});
                    localStorage.removeItem('token');
                    window.location.href = '/?error=expired';
                }
            }catch{
                throw new Error('Server error');
            }
        }else{
            throw new Error('Bad Request');
        }
    }
    
}

// atob uses base64 but jwt uses base64url. Custom function to decode jwt;
// in case our users have non-latin characters in their names (or emails as IDNs are a thing now)
// a.k.a. atob is racist :)
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}