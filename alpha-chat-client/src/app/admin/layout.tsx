"use client"
import React from 'react'
import Image from 'next/image'
import Role from '@/extenstions/roles'
import withAuth from '@/guards/AuthGuard'
import withRoleBase from '@/guards/RoleBaseGuard'
import Link from 'next/link'

const layout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (

        <div className="h-screen bg-[#fdfdfd]">
            <div className="bg-gray-800">
                <div className="h-16 px-8 flex items-center justify-between">
                    <Link href="/admin">
                        <p className="text-white font-semibold uppercase">Alpha User</p>
                    </Link>
                    <Link href="/" className="text-center rounded text-white px-6 py-2 font-semibold uppercase">
                        Back
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}

export default withAuth(withRoleBase(layout, [Role.Admin]))