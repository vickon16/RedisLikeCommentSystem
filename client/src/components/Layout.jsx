import React from 'react'
import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <main className="bg-sky-950 text-white w-full min-h-screen">
      <section className="w-full max-w-7xl mx-auto py-6 px-2">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl  my-6">Redis Post Comment System</h1>
        <Outlet />
      </section>
    </main>
  )
}

export default Layout