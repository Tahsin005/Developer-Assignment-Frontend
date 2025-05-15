import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const permissionApi = createApi({
    reducerPath: "permissionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
    }),
    tagTypes: ['Permission'],
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: () => "/permissions/",
            providesTags: ['Permission'],
            transformResponse: (response) => response.permissions || [],
        }),
    }),
});

export const { useGetPermissionsQuery } = permissionApi;