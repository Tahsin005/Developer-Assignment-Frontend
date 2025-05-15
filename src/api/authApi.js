import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
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
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "GET",
            }),
            invalidatesTags: ['User'],
        }),
        resendVerification: builder.mutation({
            query: (data) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body: data,
            }),
        }),
        resetPasswordRequest: builder.mutation({
            query: (data) => ({
                url: "/auth/reset-request",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/password-reset",
                method: "POST",
                body: data,
            })
        })
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useResendVerificationMutation,
    useResetPasswordRequestMutation,
    useResetPasswordMutation,
} = authApi;