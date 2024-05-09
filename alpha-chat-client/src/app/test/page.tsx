"use client"
import React from 'react'
import api from '@/lib/api'
import withAuth from '@/guards/AuthGuard'
import AuthService from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/contexts/auth/reducers'
import withRoleBase from '@/guards/RoleBaseGuard'
import Role from '@/extenstions/roles'

const Test = () => {
    const { dispatch } = useAuth()
    const [isFirstTime, setFirstTime] = React.useState(true)
    React.useEffect(() => {
        if (!isFirstTime) return
        setFirstTime(false)
        api.get<string>("/test/hello")
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error("error", error)
            })

    }, [isFirstTime])

    const handleLogout = async () => {
        await AuthService.signout()
        console.log("=====> Logout");

        dispatch(signOut())

    }

    return (
        <>
            <p>You see you is admin</p>
            <button onClick={() => handleLogout()}>Logout</button>
        </>
    )

}

export default withAuth(withRoleBase(Test, [Role.Admin]))