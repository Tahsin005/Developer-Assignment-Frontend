import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
    }),
    tagTypes: ['Role'],
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: () => "/roles/",
            providesTags: ['Role'],
            transformResponse: (response) => response.roles || [],
        }),
        addRole: builder.mutation({
            query: (newRole) => ({
                url: "/roles/",
                method: 'POST',
                body: newRole,
            }),
            invalidatesTags: ['Role'],
        }),
        updateRole: builder.mutation({
            query: ({ id, updatedRole }) => ({
                url: `/roles/${id}`,
                method: 'PUT',
                body: updatedRole,
            }),
            invalidatesTags: ['Role'],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Role'],
        }),
    }),
});

export const { useGetRolesQuery, useAddRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } = roleApi;