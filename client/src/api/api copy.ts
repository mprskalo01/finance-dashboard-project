import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, Account } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization header with JWT token
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Users", "Accounts", "Transactions"],
  endpoints: (build) => ({
    getUsers: build.query<Array<User>, void>({
      query: () => "user/users/",
      providesTags: ["Users"],
    }),
    getAccounts: build.query<Array<Account>, void>({
      query: () => "account/accounts/",
      providesTags: ["Accounts"],
    }),
    getUserAccount: build.query<Account, void>({
      query: () => "account/",
      providesTags: ["Accounts"],
    }),
  }),
});

export const { useGetAccountsQuery, useGetUsersQuery, useGetUserAccountQuery } =
  api;
