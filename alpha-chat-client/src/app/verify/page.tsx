'use client'
import Link from 'next/link'
import api from '@/lib/api'
import { redirect, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AuthService from '@/services/authService'


const Verify = () => {
    const searchParams = useSearchParams()
    const token = searchParams?.get("token")
    const [success, setSuccess] = useState(false)




    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await AuthService.verifyRegister(token);
                setSuccess(response.data.verified)
            } catch (err: any) {
                redirect("/error")
            }
        }
        if (token != null) {
            verifyToken();
        }
    }, [token])

    return (

        <div className='bg-gray-50 w-full h-screen '>
            {
                !success ?
                    <p className='text-center text-sm text-gray-600 py-8'>
                        The verification link has been sent in your email
                    </p>
                    : <p className='text-center text-sm text-gray-600 py-8'>
                        Verify email successfully. Please access the
                        <Link href="/login" className="text-gray-800 underline underline-offset-4"> Login</Link> page.
                    </p>
            }

        </div>
    )
}

export default Verify