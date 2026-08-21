import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

const Default = () => {
  return (
    <div>
        <Navbar />
      <main>
        <Outlet /> 
      </main>
    </div>
  )
}

export default Default