const Access_Token = 'access_token';
const Refresh_Token = 'refresh_token';
const Expires_In = 'expires_in';
const Sia = 'sia';

export function getToken() {
  let expirein = localStorage.getItem(Expires_In);
  if (parseInt(expirein) - Date.now() > 0) return localStorage.getItem(Access_Token);

  localStorage.removeItem(Access_Token);
  localStorage.removeItem(Refresh_Token);
  localStorage.removeItem(Expires_In);
  localStorage.removeItem(Sia);
  return false;

  return localStorage.getItem(Access_Token);
}

export function checkTokenExpiresin() {
  let expires_in = localStorage.getItem(Expires_In);
  if (parseInt(expires_in) - Date.now() > 0)
    return true;

  return false;
}

export function setToken(access_token, refresh_token, expires_in, sia) {
  localStorage.setItem(Access_Token, access_token);
  localStorage.setItem(Refresh_Token, refresh_token);
  localStorage.setItem(Expires_In, expires_in);
  localStorage.setItem(Sia, sia);
}

export function removeToken() {
  localStorage.removeItem(Access_Token);
  localStorage.removeItem(Refresh_Token);
  localStorage.removeItem(Expires_In);
  localStorage.removeItem(Sia);
}