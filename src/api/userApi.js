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
        changeUserRole: builder.mutation({
            query: ({ user_id, role}) => ({
                url: `/users/${user_id}/role`,
                method: "POST",
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        promoteToAdmin: builder.mutation({
            query: (user_id) => ({
                url: `/users/${user_id}/promote/admin`,
                method: "POST",
            }),
            invalidatesTags: ['User'],
        }),
        promoteToModerator: builder.mutation({
            query: (user_id) => ({
                url: `/users/${user_id}/promote/moderator`,
                method: "POST",
            }),
            invalidatesTags: ['User'],
        }),
        demoteUser: builder.mutation({
            query: ({ user_id, role}) => ({
                url: `/users/${user_id}/demote`,
                method: "POST",
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation, useRequestUserDeletionMutation, useGetMeQuery, useGetMePermissionsQuery, useChangeUserRoleMutation, usePromoteToAdminMutation, usePromoteToModeratorMutation, useDemoteUserMutation } = userApi;