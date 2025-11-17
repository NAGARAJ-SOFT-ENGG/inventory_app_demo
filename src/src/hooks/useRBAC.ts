import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { Roles } from "../constants/roles";

export const useRBAC = () => {
  const { user } = useContext(AuthContext);

  const roles = useMemo(() => {
    return user?.role ? [user.role] : [];
  }, [user]);

  const hasRole = (role: string) => roles.includes(role);
  
  const hasAnyRole = (roleList: string[]) =>
    Array.isArray(roleList) && roleList.some((r) => roles.includes(r));

  const isAdmin = hasRole(Roles.ADMIN);
  const isCustomer = hasRole(Roles.CUSTOMER);

  return {
    roles,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCustomer,
    allRoles: Roles,
  };
};
