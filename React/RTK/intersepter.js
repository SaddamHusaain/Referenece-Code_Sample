import { fetchBaseQuery, createApi, retry } from "@reduxjs/toolkit/query/react";
import { errorMessage } from "../../utils/common-function";
import { localStorageService } from "./localstorage-service";
import { REACT_APP_API_URL } from "../../constants/env";

const token = localStorageService.getAuthToken() as string;
const baseQuery = fetchBaseQuery({
  baseUrl: REACT_APP_API_URL,

  prepareHeaders: (headers) => {
    headers.set("auth", token);
    return headers;
  },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let query = await baseQuery(args, api, extraOptions);
  if (query.error && query.error.status === 401) {
    const refreshToken = await baseQuery("/refreshPath", api, extraOptions);

    if (refreshToken.data) {
      // refresh accesss token.
      query = await baseQuery(args, api, extraOptions);
    } else {
      // else Logout user.
    }
  }
  return query;
};

const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    const result: any = await baseQueryWithReAuth(args, api, extraOptions);

    if (result?.error?.status === 404) {
      retry.fail(result.error);
    }

    return result;
  },
  { maxRetries: 1 },
);

const baseQueryWithToaster = async (args: any, api: any, extraOptions: any) => {
  const { error, data } = await baseQueryWithRetry(args, api, extraOptions);

  if (error) {
    errorMessage(error?.data?.responseMessage);
    return { error: { status: error.status, data: error.data } };
  }

  return { data };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithToaster,
  tagTypes: ["Post"],
  endpoints: () => ({}),
});
