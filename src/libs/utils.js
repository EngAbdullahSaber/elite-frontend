"use client";

import { headerConfigKeyName } from "./app.config";

export function getHeaderConfig() {
  if (
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(headerConfigKeyName)
  ) {
    return {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: ` Bearer ${sessionStorage.getItem(headerConfigKeyName)}`,
      },
    };
    //  JSON.parse(sessionStorage.getItem(headerConfigKeyName));
  } else {
    return {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    };
  }
}

export const storeTokenInsessionStorage = (token) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(headerConfigKeyName, JSON.stringify(token));
  }
};

export function getToken() {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(headerConfigKeyName);
  }
  return null; // If sessionStorage is not available
}

export function clearAuthInfo() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(headerConfigKeyName);
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
