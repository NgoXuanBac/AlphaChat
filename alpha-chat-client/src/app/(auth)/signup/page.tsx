"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
    Input,
    Button,
} from "@material-tailwind/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import AuthService from '@/services/authService';


interface RegesterForm {
    email: string,
    password: string,
    confirmPassword: string
}

const Signup = () => {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {
        handleSubmit,
        control,
        getValues,
        formState: { errors }
    } = useForm<RegesterForm>({ mode: "onTouched", defaultValues: { email: "", password: "", confirmPassword: "" } })

    const onSubmit: SubmitHandler<RegesterForm> = async (data: any) => {
        try {
            setLoading(true)
            setError("")
            await AuthService.signup(data.email, data.password)
            router.push("/verify")

        } catch (error: any) {
            setError(error?.response?.data?.message || error.message)

            setLoading(false);
        }
    }
    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-[32px] ">
                <label className="text-2xl font-medium">Alpha Chat</label>
                <p className="text-slate-500">Register</p>
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
                        <Input {...field}
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
                        <Input {...field}
                            label="Password"
                            type="password"
                            crossOrigin={undefined}
                            error={Boolean(errors?.password?.message)}
                            disabled={loading}
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

            <div className="w-full px-4 py-2 ">
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: "Confirm password is required",
                        validate: value => getValues('password').trim() === value.trim() || "Confirm password do not match"
                    }}
                    render={({ field }) => (
                        <Input {...field}
                            label="Confirm password"
                            type="password" crossOrigin={undefined}
                            error={Boolean(errors?.confirmPassword?.message)}
                            disabled={loading}
                        />

                    )}
                />
                {
                    errors?.confirmPassword?.message && (
                        <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1">
                            {errors?.confirmPassword?.message}
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
                                Sign up
                            </Button>
                        )
                }
            </div>


            <div className="w-full px-4 py-4  ">
                <p className="text-sm text-gray-600 text-center md:text-left">
                    Already have an account? <Link href="/login" className="text-gray-800 hover:underline hover:underline-offset-4">Login</Link>
                </p>
            </div>
        </form>

    )
}

export default Signup