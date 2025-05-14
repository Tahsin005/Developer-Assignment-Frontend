import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: "/users/",
                method: "GET",
            }),
        }),
        getUserById: builder.query({
            query: (userId) => `/users/${userId}`,
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;