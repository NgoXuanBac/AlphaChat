import { User } from "@/extenstions/models";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';


interface UserItemProps {
    user: User,
    deleteUser: (id: number) => void;
}

const UserItem = ({ user, deleteUser }: UserItemProps) => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(!open)
    const router = useRouter();
    const editUser = (id: number) => {
        router.replace(`admin/user?id=${id}`)
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} placeholder={undefined} className="bg-[#fdfdfd] w-full rounded">
                <DialogHeader placeholder={undefined} className="font-normal">Delete Message</DialogHeader>
                <DialogBody placeholder={undefined} className="text-gray-600">
                    You want to delete this user permanently
                </DialogBody>
                <DialogFooter placeholder={undefined}>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1 rounded"
                        placeholder={undefined}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        color="black"
                        className="rounded"
                        onClick={() => deleteUser(user.id)}
                        placeholder={undefined}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog >

            <tr key={user.id}>
                <td className="text-left px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.fullName}</div>
                </td>
                <td className="text-left px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="text-left px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.roles.join(', ')}</div>
                </td>
                <td className="text-right px-6 py-4 whitespace-nowrap font-medium text-sm">
                    <a
                        onClick={() => editUser(user.id)}
                        className="text-indigo-600 hover:text-indigo-800 px-4 hover:cursor-pointer">
                        Edit
                    </a>
                    <a
                        onClick={handleOpen}
                        className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer">
                        Delete
                    </a>
                </td>
            </tr>
        </>

    );
};

export default UserItem