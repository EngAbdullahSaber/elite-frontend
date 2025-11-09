"use client";

import { headerConfigKeyName } from "./app.config";

export function getHeaderConfig() {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem(headerConfigKeyName)
  ) {
    return {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: ` Bearer ${localStorage.getItem(headerConfigKeyName)}`,
      },
    };
    //  JSON.parse(localStorage.getItem(headerConfigKeyName));
  } else {
    return {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    };
  }
}

export const storeTokenInLocalStorage = (token) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(headerConfigKeyName, JSON.stringify(token));
  }
};

export function getToken() {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(headerConfigKeyName);
  }
  return null; // If localStorage is not available
}

export function clearAuthInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
  }
}

export function makeFilterString(filter_obj) {
  var filterString = "?";
  Object.keys(filter_obj).map(function (key) {
    if (filter_obj[key] != null) {
      filterString += key + "=" + filter_obj[key] + "&";
    } else {
      return false;
    }
  });

  return filterString;
}
