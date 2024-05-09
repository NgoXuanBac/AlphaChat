"use client"
import { FEMALE_AVATAR, MALE_AVATAR } from '@/extenstions/constants';
import { Button, Dialog, Input, Spinner } from '@material-tailwind/react';
import { Pencil, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { cn, randomCharacters } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import userService from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import withAuth from '@/guards/AuthGuard';
import { useRouter } from "next/navigation";
import { signIn } from '@/contexts/auth/reducers';
import { User } from '@/extenstions/models';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const metadata = {
    contentType: 'image/jpeg',
};

interface ProfileForm {
    nickname: string,
}

const UserProfile = () => {

    const { user, dispatch } = useAuth()
    const isFirstTime = () => user!.status === 'FIRST_TIME'
    const router = useRouter();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ProfileForm>({
        mode: "onTouched", defaultValues: {
            nickname: isFirstTime() ? randomCharacters(8) : user?.fullName
        }
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatar, setAvatar] = useState(isFirstTime() ? MALE_AVATAR : user!.avatar)
    const [image, setImage] = useState<File>()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true);

    const handleOpen = () => setOpen((cur) => !cur);

    const onSubmit: SubmitHandler<ProfileForm> = async (data: any) => {
        if (!user) return;

        setLoading(true)

        const upload = async () => {
            try {
                await userService.uploadProfile(data.nickname, avatarUrl)
                dispatch(signIn({ user: { ...user, avatar: avatarUrl, fullName: data.nickname, status: "ONLINE" } }))
                router.replace("/")
                setOpen(false)
                setLoading(false)

            } catch (error) {
                console.log(error);
            }
        }

        let avatarUrl = avatar;
        if (image) {
            const storageRef = ref(storage, `images/avatar${crypto.randomUUID()}`);
            const uploadTask = uploadBytesResumable(storageRef, image, metadata);
            uploadTask.on(
                'state_changed',
                (snapshot) => { },
                (error) => { console.log(error) },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        setImage(undefined);
                        avatarUrl = downloadURL
                        upload()
                    });
                }
            );
        } else {
            upload()
        }
    }


    useEffect(() => {
        return () => {
            (avatar !== MALE_AVATAR && avatar !== FEMALE_AVATAR) && URL.revokeObjectURL(avatar)
        }
    }, [avatar])

    const changeDefaultAvatar = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        setAvatar((pre) => {
            if (pre === MALE_AVATAR || pre === FEMALE_AVATAR)
                return pre === MALE_AVATAR ? FEMALE_AVATAR : MALE_AVATAR
            return pre
        })
    }

    const handlePreviewAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        const file = event.target.files[0]
        if (!file) return;
        setImage(file)
        setAvatar(URL.createObjectURL(file))
    }


    return (
        <div className="flex justify-center items-center w-full h-full">
            <Dialog
                size="xs"
                open={open}
                handler={() => null}
                className="flex flex-col justify-center items-center max-w-xs bg-white shadow-xl rounded-xl p-5 relative"
                placeholder={undefined}            >
                {!isFirstTime() &&
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-9 w-9",
                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                            "absolute top-1 right-1 z-50"
                        )}
                        onClick={handleOpen}
                    >
                        <X />
                    </Link>
                }

                <div className="relative w-full" >
                    <img
                        className="w-32 h-32 mx-auto shadow-xl rounded-full"
                        src={avatar}
                        alt="nature image"
                        onClick={changeDefaultAvatar}
                    />
                    <input
                        onChange={handlePreviewAvatar}
                        multiple={false}
                        ref={fileInputRef}
                        type='file'
                        accept="image/png, image/jpeg"
                        hidden
                    />

                    <button
                        className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full
                                     bg-gray-800 hover:bg-gray-700 border border-gray-600"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Pencil
                            className="w-3 h-3"
                            color="#ffff"
                            absoluteStrokeWidth={true}
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full">
                    <div className="w-full px-4 py-2 ">
                        <Controller
                            name="nickname"
                            control={control}
                            rules={{
                                required: "Nick name is required",
                            }}
                            render={({ field }) => (
                                <Input  {...field}
                                    label="Nick name"
                                    type="text"
                                    crossOrigin={undefined}
                                    error={Boolean(errors?.nickname?.message)}
                                    disabled={loading}
                                />
                            )}
                        />
                        {
                            errors?.nickname?.message && (
                                <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1">
                                    {errors?.nickname?.message}
                                </span>
                            )
                        }
                        <div className="flex justify-center mt-4">
                            {loading ?
                                (<Spinner />)
                                : (
                                    <Button
                                        type="submit"
                                        className="w-full  rounded normal-case"
                                        placeholder={undefined}
                                    >
                                        Enter
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </form>
            </Dialog>

        </div>
    )
}
export default withAuth(UserProfile)
