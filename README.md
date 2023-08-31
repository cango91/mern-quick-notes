# QUICK NOTES

<blockquote>No longer will you forget that thing you wish you'd noted down</blockquote>

## MERN-Infrastructure
Quick Notes lab builds on top of MERN-Infrastructure in the following manner:
+ Adds a new simple **Note model**. Notes are stored encrypted (TODO: refactor to use pre/post save hooks) and allow user-centric full-CRUD.
+ **Adds refresh tokens**: JWT are short-lived, refresh tokens are longer lived (in this case 7 days) and are rotated on each JWT refresh. This prevents frequent log-in while adding a layer of security. Also the refresh token is stored client-side in strict-same-site HTTP-only (and in production HTTPS-only) cookie, which implicitly adds some degree of CSRF and XSS protection. 

    While an unexpired refresh token exists, JWT renewal happens seamlessly between client and server via the `bearer` middleware - a variation on the token middleware implemented in class - and `New-Access-Token` response header, without interrupting current request.

    Refresh tokens also enable server-side logout, which is a nice to have in case a JWT becomes compromised (current refresh token used by the cliet is deleted on logout. Reason not to have one-to-one mapping between user and refresh token is to allow multiple device sessions/logins)
+ **Ditches `atob()`** in favor of custom function (not mine): `atob` uses `base64` whereas JWT uses `base64url`, which means any unicode character in the token will break the client side if atob is used. Instead, a custom prseJwt function does the parsing, factoring in the correct encoding.

  See this question and top answer on [Stack Overflow](https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library) for more details and the function.
