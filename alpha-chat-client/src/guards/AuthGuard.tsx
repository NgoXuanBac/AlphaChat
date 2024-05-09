"use client"
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";


const withAuth = (Component: any) => {
    return function WithAuth(props: any) {
        const { isInitialized, isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isInitialized) return

            if (!isAuthenticated) {
                router.replace("/login")
            }
        }, [isInitialized, isAuthenticated, router]);

        if (!isInitialized || !isAuthenticated)
            return <Loading />;


        return <Component {...props} />;
    }
}
export default withAuth