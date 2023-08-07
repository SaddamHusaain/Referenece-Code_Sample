import { apiUrls } from "../../constants/apiUrls";
import { api } from "./api";

export const loginApi: any = api.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (payload: any) => {
        return {
          url: apiUrls.LOGIN,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
export const {
  endpoints: { loginUser },
} = loginApi;
