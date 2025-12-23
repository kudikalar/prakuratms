import { PERMISSIONS } from "../config/permissions";

export default function usePermission(module, action = "view") {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {}

  const role = user?.role;
  return PERMISSIONS[role]?.[module]?.includes(action);
}
