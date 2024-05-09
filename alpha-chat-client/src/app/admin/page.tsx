"use client"

import React, { useEffect, useState } from 'react'
import adminService from '@/services/adminService'
import Link from 'next/link'
import UserItem from '@/components/admin/user-item'
import { User } from '@/extenstions/models'


const UserManagement = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true)
                const response = await adminService.getAll()

                setUsers(response.data)
                setLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        loadUsers()

    }, [])



    const deleteUser = async (id: number) => {
        try {
            await adminService.deleteUser(id)
            setUsers(users => users.filter((user) => user.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (


        <div className="container mx-auto my-8">
            <div className="h-12 flex justify-between items-center">
                <Link href="/admin/user" className="text-center rounded bg-gray-800 text-white px-6 py-2">
                    Add
                </Link>

            </div>

            <div className="flex shadow border-b">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                                Nick Name
                            </th>
                            <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                                Email ID
                            </th>
                            <th className="text-left font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                                Roles
                            </th>
                            <th className="text-right font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    {!loading &&
                        <tbody className="bg-white">
                            {users.map((user) => (
                                <UserItem key={user.id} user={user} deleteUser={deleteUser} />
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>



    )
}

export default UserManagement
