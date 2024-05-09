"use client"
import React from 'react'
import { AlertCircle } from 'lucide-react';

const Error = () => {
    return (
        <div className='bg-gray-50 w-full h-screen flex items-center flex-col  py-8'>
            <AlertCircle color='#ff2929' />
            <p className='text-center text-sm text-gray-600'>
                Oops! Something went wrong
            </p>
        </div>
    )
}
export default Error