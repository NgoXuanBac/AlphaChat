"use client"
import {
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import Image from 'next/image'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';

import AuthService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "@/contexts/auth/reducers";


interface LoginForm {
  email: string,
  password: string,
}

const getDefaultValue = () => {
  if (hasCookie("remember-account")) {
    var account = JSON.parse(getCookie("remember-account") + "");
    return { email: account.email, password: account.password }

  }
  return { email: "", password: "" }
}

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginForm>({ mode: "onTouched", defaultValues: getDefaultValue() })
  const router = useRouter()
  const { dispatch } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState("false")

  const onSubmit: SubmitHandler<LoginForm> = async (data: any) => {
    try {
      setLoading(true)
      setError("")
      var response = await AuthService.login(data.email, data.password)
      dispatch(signIn({ user: response.data }))

      if (remember === "true")
        setCookie("remember-account", { email: data.email, password: data.password })
      else
        deleteCookie("remember-account")

      router.push("/")
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message)
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-[32px] ">
        <label className="text-2xl font-medium">Alpha Chat</label>
        <p className="text-slate-500">Login</p>
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
      <div className="w-full px-4 py-2">
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field }) => (
            <Input  {...field}
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
      {
        error && (
          <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-5">
            {error}
          </span>
        )
      }
      <div className="w-full px-4 md:px-1 py-2 flex flex-row justify-end md:justify-between md:items-center">
        <div className="hidden md:inline-flex">
          <Checkbox
            className="w-4 h-4  rounded-sm" label={
              <p className="text-sm">
                Remember Me
              </p>
            }
            defaultChecked={remember === "true"}
            onChange={() => {
              setRemember(remember => remember === "true" ? "false" : "true")
            }}
            value={remember}
            crossOrigin={undefined}
          />
        </div>

        <Link href="/forgotpassword" className="text-center text-sm text-gray-800 hover:underline hover:underline-offset-4 mr-0 md:mr-2 mb-4 md:mb-0">Forgot Password?</Link>
      </div>

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
                Login
              </Button>
            )
        }
      </div>



      <div className="w-full px-4 py-4  ">
        <p className="text-sm text-gray-600 text-center md:text-left">
          Don&apos;t have an account? <Link href="/signup" className="text-gray-800 hover:underline hover:underline-offset-4">Register</Link>
        </p>
      </div>


    </form>

  )
}

export default Login