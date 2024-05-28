import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Reguser from '../pages/Reguser'
import { getCookie } from '../untils/auth'
import MainNav from '../pages/MainNav'
import SystemUser from '../pages/SystemUser'
import SystemTeam from '../pages/SystemTeam'
import SystemRegister from '../pages/SystemRegister'
import SystemAnnouncement from '../pages/SystemAnnouncement'
import SystemHospitalAnnouncement from '../pages/SystemHospitalAnnouncement'
import SystemRotograph from '../pages/SystemRotograph'
import MedicalTreatment from '../pages/MedicalTreatment'

export default function Router() {
  const location = useLocation()
  const { pathname } = location
  const router = [
    {
      path: '/login',
      element: <Login />,
      auth: false
    },
    {
      path: '/reguser',
      element: <Reguser />,
      auth: false
    },
    {
      path: '/mainNav',
      element: <MainNav />,
      auth: true,
      children: [
        {
          path: 'systemUser',
          element: <SystemUser />,
          auth: true
        },
        {
          path: 'systemTeam',
          element: <SystemTeam />,
          auth: true
        },
        {
          path: 'systemRegister',
          element: <SystemRegister />,
          auth: true
        },
        {
          path: 'systemAnnouncement',
          element: <SystemAnnouncement />,
          auth: true
        },
        {
          path: 'systemHospitalAnnouncement',
          element: <SystemHospitalAnnouncement />,
          auth: true
        },
        {
          path: 'systemRotograph',
          element: <SystemRotograph />,
          auth: true
        },
        {
          path: 'medicalTreatment',
          element: <MedicalTreatment />,
          auth: true
        }
      ]
    },
    {
      path: '/',
      element: <Navigate to="/mainNav/systemTeam" />
    }
  ]
  const RouteNav = (router) => {
    return router.map((item) => {
      return (
        <Route
          path={item.path}
          element={
            item.auth && !getCookie('token_admin') ? (
              <Navigate to="/login" replace={true}></Navigate>
            ) : getCookie('token_admin') && pathname === '/login' ? (
              <Navigate to="/mainNav"></Navigate>
            ) : (
              item.element
            )
          }
          key={item.path}
        >
          {item.children && RouteNav(item.children)}
        </Route>
      )
    })
  }
  return <Routes>{RouteNav(router)}</Routes>
}
