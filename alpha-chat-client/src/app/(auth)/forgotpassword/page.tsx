'use client'
import Link from 'next/link'
import api from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import Image from 'next/image'

import {
    Input,
    Button,
} from "@material-tailwind/react";
import AuthService from '@/services/authService'

interface ForgotForm {
    email: string
}


const ForgotPassword = () => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ForgotForm>({ mode: "onTouched", defaultValues: { email: "" } })

    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    const onSubmit: SubmitHandler<ForgotForm> = async (data: any) => {
        try {
            setError("")
            setLoading(true)
            const response = await AuthService.forgotPassword(data.email)
            setSuccess(response.status)
        } catch (err: any) {
            setSuccess(false)
            setError(err?.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full px-4 py-2">
                <p className='text-lg font-medium'>Reset your password</p>
                <p className="text-xs text-gray-600 text-left">
                    Enter your emal and we will send you instructions on how to reset your password.
                </p>
            </div>

            <div className="w-full px-4 py-2 ">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                            message: "Email is invalid"
                        }
                    }}
                    render={({ field }) => (
                        <Input  {...field}
                            label="Email"
                            type="email" crossOrigin={undefined}
                            error={Boolean(errors?.email?.message)}
                            disabled={loading}
                        />
                    )}
                />
                {
                    errors?.email?.message && (
                        <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1">
                            {errors?.email?.message}
                        </span>
                    )
                }
            </div>

            {
                error && (
                    <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-5">
                        {error}
                    </span>
                )
            }
            {
                success && (
                    <span className="flex items-center tracking-wide text-xs text-green-500 mt-1 ml-5">
                        The verification link has been sent in your email
                    </span>
                )
            }


            <div className='px-4 py-2'>
                {
                    loading ?
                        (
                            <Image
                                src="/Loading.gif"
                                alt="loading"
                                width={0}
                                height={0}
                                className="w-12"
                                priority
                            />
                        )
                        : (
                            <Button
                                type="submit"
                                placeholder={undefined}
                                className="w-full md:w-auto normal-case"
                            >
                                Send
                            </Button>
                        )
                }
            </div>



            <div className="w-full px-4 py-4  ">
                <p className="text-xs text-gray-600 text-center md:text-left">
                    Go back to <Link href="/login" className="text-gray-800 underline underline-offset-4">Login</Link>
                </p>
            </div>




        </form>
    )



}

export default ForgotPassword