'use client'
import Link from 'next/link'
import api from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import Image from 'next/image'

import {
    Input,
    Button,
} from "@material-tailwind/react";
import AuthService from '@/services/authService'


interface ResetForm {
    password: string
}

const ResetVerify = () => {
    const searchParams = useSearchParams()
    const token = searchParams?.get("token")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ResetForm>({ mode: "onTouched", defaultValues: { password: "" } })


    const onSubmit: SubmitHandler<ResetForm> = async (data: any) => {
        if (token == null) return
        try {
            setLoading(true);
            const response = await AuthService.resetPassword(data.password, token)
            setSuccess(response.message)
        } catch (err: any) {
            setSuccess("")
            setError(err?.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }


    }
    return (
        <>

            {
                token == null ?
                    <p className='text-center text-sm text-gray-600 py-8'>
                        Verify email failed. Go back to <Link href="/login" className=" text-gray-800 underline underline-offset-4">Login</Link>
                    </p>

                    : <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full px-4 py-2">
                            <p className='text-lg font-medium'>Reset your password</p>
                            <p className="text-xs text-gray-600 text-left">
                                Enter your new password
                            </p>
                        </div>

                        {

                            <div className="w-full px-4 py-2 ">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*[a-zA-Z0-9]).{6,}$/,
                                            message: "Password must have at least 6 characters"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input  {...field}
                                            label="New password"
                                            type="password" crossOrigin={undefined}
                                            error={Boolean(errors?.password?.message)}
                                            disabled={loading && success === ""}
                                        />
                                    )}
                                />
                                {
                                    errors?.password?.message && (
                                        <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1">
                                            {errors?.password?.message}
                                        </span>
                                    )
                                }
                            </div>

                        }

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
                                    {success}
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
                                            disabled={success !== ""}
                                        >
                                            Reset
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
            }

        </>

    )
}

export default ResetVerify