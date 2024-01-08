import { ENDPIONTS, PagingOptions } from "@api";
import { UserInfoViewModel, UserProjectsVW } from "@viewModels";
import { Project } from "@models";
import axios, { CancelTokenSource } from "axios";
import Swal from "sweetalert2";
import crypto from "crypto-js";

export interface HTTPServiceOptions {
  ignorePagination: boolean
}

export const BASE_CURRENCY = "$";
let BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = "https://localhost:7079/api/";
} else {
  BASE_URL = "https://ticketsys.slmof.org/api/api/";
}

export const httpService = <T>(endpoint: string, options?: PagingOptions | URLSearchParams | string, serviceOptions?: HTTPServiceOptions) => {
  const query = options ?? (serviceOptions?.ignorePagination ? new PagingOptions(1, -1) : new PagingOptions());

  const formatedQuery = typeof (options) === "string" ? options :
    query instanceof PagingOptions ? query.format() : query.toString();

  const url = BASE_URL + endpoint;

  requestInterceptors();
  responseInterceptors();

  return {
    getAll: () =>
      axios.get(url + `?${formatedQuery}`),
    getById: (id: any) =>
      axios.get(url + "/" + id + `?${formatedQuery}`),
    post: (newRecord: T) =>
      axios.post(url, newRecord),
    update: (id: number, updatedRecord: T) =>
      axios.put(url + "/" + id, updatedRecord),
    delete: (id: number) =>
      axios.delete(url + "/" + id),
  };
};

const requestInterceptors = () => {
  axios.interceptors.request.use((request: any) => {
    // add auth header with jwt if account is logged in and request is to the api url
    const token = getUserInfo().token;
    const isLoggedIn = token ? true : false;
    const isApiUrl = request?.url?.startsWith(BASE_URL);

    if (isLoggedIn && isApiUrl) {
      request!.headers!.common!.Authorization = `Bearer ${token}`;
      request!.headers!.common!["project-id"] = (getUserProject()?.projectId ?? 0).toString();
    }

    return request;
  });
};

const responseInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          showConfirmButton: false,
          text: "The record has been added successfully.",
        });
      }
      if (response.status === 204) {
        Swal.fire({
          icon: "success",
          showConfirmButton: false,
          text: "The record has been Updated successfully.",
        });
      }

      return response;
    },
    (error) => {
      if (!axios.isCancel(error) && !error.response) {
        Swal.fire({
          title: "Oops",
          text: "Unable to reach the server. Please check your reachability to the server.",
          icon: "error",
          toast: true,
        });
        return error;
      }
      if (error.response.status === 401) {
        Swal.fire({
          toast: true,
          icon: "error",
          showConfirmButton: false,
          text:
            error?.response?.data?.message ??
            "Your seesion has expired, you will be redirected to login page.",
        });

        !error?.response?.data && logout();
      }
      if (error.response.status === 403) {
        window.location.replace("/unauthorized");
      }
      if (error.response.status === 400) {
        Swal.fire({
          text: `${error?.response?.data?.message ??
            "An unprecedented error occurred, please try again."
            }`,
          showConfirmButton: false,
          icon: "error",
          toast: true,
        });
      }
      if (error.response.status === 404) {
        Swal.fire({
          title: "Oops",
          text: "Requested object not found",
          icon: "error",
          toast: true,
        });
      }
      if (error.response.status === 500) {
        Swal.fire({
          title: "Oops",
          text: "An unprecedented error occurred, please try again.",
          icon: "error",
          toast: true,
        });
      }
      return error;
    }
  );
};

export const logout = () => {
  const currentURL = window.location.pathname;
  localStorage.removeItem("sys_user");
  localStorage.removeItem("project");
  window.location.assign(`/auth/login?returnUrl=${currentURL}`);
  return;
};

export const getUserInfo = () => {
  let decryptedData = new UserInfoViewModel();

  const currentUser = JSON.parse(
    localStorage.getItem("sys_user") ?? '""'
  ) as string;
  if (currentUser) {
    // Decrypt
    const bytes = crypto.AES.decrypt(currentUser, "secret key 123");
    decryptedData = JSON.parse(
      bytes.toString(crypto.enc.Utf8)
    ) as UserInfoViewModel;
  }

  return decryptedData;
};

export const getUserProject = () => {
  var value = localStorage.getItem("project");

  if (typeof value === "string") {
    const project: UserProjectsVW = JSON.parse(value);
    if (project) {
      return project;
    }
  }

  return null;
};