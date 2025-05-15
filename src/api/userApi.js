import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        // prepareHeaders: (headers, { getState }) => {
        //     const token = getState().auth.user?.token;
        //     if (token) {
        //         headers.set('Authorization', `Bearer ${token}`);
        //     }
        //     return headers;
        // },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: "/users/",
                method: "GET",
            }),
            providesTags: ['User'],
        }),
        getUserById: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),
        updateUser: builder.mutation({
            query: ({ user_id, userData }) => ({
                url: `/users/${user_id}`,
                method: "PUT",
                body: userData,
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'User'],
        }),
        deleteUser: builder.mutation({
            query: (user_id) => ({
                url: `/users/${user_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['User'], 
        }),
        requestUserDeletion: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}/request-deletion`,
                method: "POST",
            }),
            invalidatesTags: ['User'],
        }),
        getMe: builder.query({
            query: () => '/me',
            providesTags: ['User'],
        }),
        getMePermissions: builder.query({
            query: () => '/me/permissions',
            providesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation, useRequestUserDeletionMutation, useGetMeQuery, useGetMePermissionsQuery } = userApi;