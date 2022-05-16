// import moment from "moment";
import Cookies from "js-cookie";
// require("moment-timezone");

export const action = (actionName, load) => ({
  type: actionName,
  payLoad: load
});

export const requestHelper = (url, method, headers, data) => {
  const requestLoad = {
    method,
    headers: {
      ...headers,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const getLoad = {
    method,
    headers: { ...headers, "Content-Type": "application/json" }
  };
  return fetch(url, method === "GET" ? getLoad : requestLoad)
};

// const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const isValidEmail = email => {
//   return EMAIL_REGEX.test(email);
// };

export const getDeviceId = async () => {

  return await Cookies.get("deviceId");
};

//notificationStatus
export const getNotificationStatus = async () => {

  return await Cookies.get("notificationStatus");
};
export const setNotificationStatus = async (status) => {

  return await Cookies.set("notificationStatus", status, { expires: 1 });

};


// export const getToken = async () => {
//   return await Cookies.get("userToken");
// }

export const getToken =  () => {
  return  localStorage.getItem('token');
}

export const setToken = async (token) => {
  return await Cookies.set("userToken",token);
}
export const clearToken = async () => {
  return await Cookies.remove("userToken");
}