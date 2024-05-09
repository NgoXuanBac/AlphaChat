"use client"
import NotPermission from "@/components/error/not-permission";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";



const withRoleBase = (Component: any, accessibleRoles: Array<string>) => {
    return function WithRoleBase(props: any) {
        const { user } = useAuth();
        const [isAccessible, setIsAccessible] = useState(false);

        useEffect(() => {
            if (!user) return;
            const isRoleMatched = user.roles.some(r => accessibleRoles.includes(r));
            setIsAccessible(isRoleMatched);

        }, [user]);

        if (!isAccessible) {
            return <NotPermission />
        }
        return <Component {...props} />
    }
}
export default withRoleBase
