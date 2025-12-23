export const PERMISSIONS = {
  Admin: {
    dashboard: ["view"],
    users: ["view", "create", "edit", "delete"],
    courses: ["view", "create", "edit"],
  },
  Educator: {
    dashboard: ["view"],
    courses: ["view"],
  },
};
