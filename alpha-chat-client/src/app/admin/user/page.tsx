"use client"

import React, { useEffect, useState } from 'react'
import adminService from '@/services/adminService'
import { User } from '@/extenstions/models'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { cn } from '@/lib/utils'



interface UserForm {
    email: string,
    password: string,
    roles: string[]
}
interface UserDetail {
    id: number,
    fullName: string,
    email: string,
    status: string,
    avatar: string,
    password: string,
    roles: Array<string>
}


const EditUser = () => {
    const router = useRouter();

    const searchParams = useSearchParams()
    const id = searchParams?.get("id")
    const [user, setUser] = useState<UserDetail | null>(null);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)


    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
        reset
    } = useForm<UserForm>({ mode: "onTouched", defaultValues: { email: "", password: "", roles: [] } })

    useEffect(() => {
        setLoading(false)
        if (id == null) return;
        setLoading(true)
        const loadUser = async () => {
            try {
                const response = await adminService.getUser(parseInt(id))

                setUser(response.data)
                reset({ email: response.data.email, password: "", roles: response.data.roles })

            } catch (error) {
                console.error(error)
            }
        }
        loadUser()
        setLoading(false)
    }, [])
    const handleClose = () => {
        router.replace('/admin')
    }
    const onSubmit = async (data: any) => {
        try {
            setLoading(true)
            if (id) {
                await adminService.updateUser({
                    id: id,
                    email: data.email,
                    password: data.password,
                    roles: data.roles
                })
            } else {
                await adminService.addUser({
                    email: data.email,
                    password: data.password,
                    roles: data.roles
                })
            }
            router.replace('/admin')
        } catch (error: any) {
            setError(error?.response?.data?.data || error.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex max-w-2xl mx-auto shadow border-b mt-10">
            <form className="px-8 py-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="font-normal text-2xl tracking-wider">
                    <h1>{id ? "Update user" : "Add User"}</h1>
                </div>
                <div className="items-center justify-center h-14 w-full my-4">
                    <label className="block text-gray-600 text-sm font-normal">
                        Email
                    </label>
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
                            <input {...field}
                                defaultValue={user?.email}
                                type="text"
                                name="email"
                                className={cn("h-10 w-96 border mt-2 px-2 py-2",
                                    errors?.email?.message ? "border-red-500" : ""
                                )}
                            />

                        )}
                    />
                    {
                        errors?.email?.message && (
                            <span className="flex items-center tracking-wide text-xs text-red-500 mt-1">
                                {errors?.email?.message}
                            </span>
                        )
                    }
                </div>
                <div className="items-center justify-center h-14 w-full my-4 mt-12">
                    <label className="block text-gray-600 text-sm font-normal">
                        Password
                    </label>
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
                            <input {...field}
                                type="text"
                                name="password"
                                className={cn("h-10 w-96 border mt-2 px-2 py-2",
                                    errors?.password?.message ? "border-red-500" : ""
                                )}
                            />
                        )}
                    />
                    {
                        errors?.password?.message && (
                            <span className="flex items-center tracking-wide text-xs text-red-500 mt-1">
                                {errors?.password?.message}
                            </span>
                        )
                    }

                </div>
                <div className="h-14 w-full my-4 mt-12">
                    <label className="block text-gray-600 text-sm font-normal">
                        Role
                    </label>
                    <Controller
                        name="roles"
                        control={control}
                        rules={{ required: 'At least one option must be selected' }}
                        render={({ field }) => (
                            <div className="flex items-center gap-x-4 mt-2">
                                <div className="flex items-center ">
                                    <input {...register(field.name)}
                                        type="checkbox"
                                        name="roles"
                                        className={cn("h-6 w-6 border px-2 py-2",
                                            errors?.roles?.message ? "border-red-500 " : ""
                                        )}

                                        value={"ADMIN"}
                                    />
                                    <label className="block text-gray-600 text-sm font-normal ml-2">
                                        Admin
                                    </label>
                                </div>

                                <div className="flex items-center ">
                                    <input {...register(field.name)}
                                        type="checkbox"
                                        name="roles"
                                        className={cn("h-6 w-6 border px-2 py-2",
                                            errors?.roles?.message ? "border-red-500" : ""
                                        )}

                                        value={"USER"}
                                    />
                                    <label className="block text-gray-600 text-sm font-normal ml-2">
                                        User
                                    </label>
                                </div>
                            </div>
                        )}
                    />
                    {
                        errors?.roles?.message && (
                            <span className="flex items-center tracking-wide text-xs text-red-500 mt-1">
                                {errors?.roles?.message}
                            </span>
                        )
                    }

                </div>

                {
                    error && (
                        <span className="flex items-center tracking-wide text-xs text-red-500 mt-1">
                            {error}
                        </span>
                    )
                }

                <div className="items-center justify-center h-14 w-full my-4 space-x-4 pt-4">
                    <button
                        className="rounded text-white bg-green-400 hover:bg-green-700 py-2 px-6"
                        type="submit" disabled={loading}
                    >
                        Save
                    </button>
                    <button
                        className="rounded text-white bg-red-400 hover:bg-red-700 py-2 px-6"
                        onClick={handleClose} disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    )
}

export default EditUser
