"use client"
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const withFirstTime = (Component: any) => {
    return function WithFirstTime(props: any) {
        const { user } = useAuth();
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            if (!user) return;
            setIsLoading(false);
            if (user.status === 'FIRST_TIME') {
                router.replace("/user")
            }
        }, [user]);

        if (isLoading) {
            return <Loading />
        }
        return <Component {...props} />
    }
}
export default withFirstTime
