import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "ChargerPoints"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),

    //
    getChargerPoints: build.query({
        query: () => "/ocpp/chargerPoints",
        providesTags: ["ChargerPoints"],
      }),
    addNewChargerStation: build.mutation({
        query: (payload) => ({
            url: '/ocpp/chargerPoints',
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['ChargerPoints'],
    }),
    deleteChargerStation: build.mutation({
        query: (id) => ({
            url: `/ocpp/chargerPoints/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags : ['ChargerPoints']
    }),
    startRemoteChargerStation: build.mutation({
        query: (payload) => ({
            url: `/ocpp/chargerPoints/start/64107f2e147b550a5bc8d48c`,
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        }),
        invalidatesTags : ['ChargerPoints']
    }),
    stopRemoteChargerStation: build.mutation({
        query: (payload) => ({
            url: `/ocpp/chargerPoints/stop`,
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        }),
        invalidatesTags : ['ChargerPoints']
    })
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetChargerPointsQuery,
  useAddNewChargerStationMutation,
  useDeleteChargerStationMutation,
  useStartRemoteChargerStationMutation,
  useStopRemoteChargerStationMutation
} = api;
