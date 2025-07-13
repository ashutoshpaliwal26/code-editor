"use client"

import SignUpForm from '@/components/Auth/Signup'
import React from 'react'

const page = () => {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  return (
    <>
        <SignUpForm/>
    </>
  )
}

export default page
