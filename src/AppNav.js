import React, {lazy, Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import ErrorPage from './views/ErrorPage'
import Load from './Load'

const AdminLayout = lazy(()=>import('./views/AdminLayout'))
const AdminDash = lazy(()=>import('./views/AdminDash'))
const AdminProdAdd = lazy(()=>import('./views/AdminProdAdd'))
const AdminProdEdit = lazy(()=>import('./views/AdminProdEdit'))
const AdminProducts = lazy(()=>import('./views/AdminProducts'))
const HomeLayout = lazy(()=>import('./views/HomeLayout'))
const Account = lazy(()=>import('./views/Account'))
const AccountLogin = lazy(()=>import('./views/AccountLogin'))
const Home = lazy(()=>import('./views/Home'))
const Cart = lazy(()=>import('./views/Cart'))
const Orders = lazy(()=>import('./views/Orders'))
const AdminOrders = lazy(()=>import('./views/AdminOrders'))
const AdminOrderView = lazy(()=>import('./views/AdminOrderView'))
const AdminLogin = lazy(()=>import('./views/AdminLogin'))

export default function AppNav() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Suspense fallback={<Load />}><HomeLayout /></Suspense>,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/',
                    element: <Suspense fallback={<Load />}><Home /></Suspense>
                },
                {
                    path: '/cart',
                    element: <Suspense fallback={<Load />}><Cart /></Suspense>
                },
                {
                    path: '/account',
                    element: <Suspense fallback={<Load />}><Account /></Suspense>
                },
                {
                    path: '/account/orders/:id',
                    element: <Suspense fallback={<Load />}><Orders /></Suspense>
                },
                {
                    path: '/account-login',
                    element: <Suspense fallback={<Load />}><AccountLogin /></Suspense>
                },
            ]
        },
        {
            path: '/admin-login',
            element: <Suspense fallback={<Load />}><AdminLogin /></Suspense>,
            errorElement: <ErrorPage />
        },
        {
            path: '/admin',
            element: <Suspense fallback={<Load />}><AdminLayout /></Suspense>,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/admin',
                    element: <Suspense fallback={<Load />}><AdminDash /></Suspense>
                },
                {
                    path: '/admin/products',
                    element: <Suspense fallback={<Load />}><AdminProducts /></Suspense>
                },
                {
                    path: '/admin/addproduct',
                    element: <Suspense fallback={<Load />}><AdminProdAdd /></Suspense>
                },
                {
                    path: '/admin/product/edit/:id',
                    element: <Suspense fallback={<Load />}><AdminProdEdit /></Suspense>
                },
                {
                    path: '/admin/orders',
                    element: <Suspense fallback={<Load />}><AdminOrders /></Suspense>
                },
                {
                    path: '/admin/orders/:id',
                    element: <Suspense fallback={<Load />}><AdminOrderView /></Suspense>
                },
            ]
        }
    ])
  return (
    <RouterProvider router={router} />
  )
}
