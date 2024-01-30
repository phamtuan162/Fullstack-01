module.exports = {
  isPermission: (obj, value) => {
    return obj.permissions.find((item) => item.value === value);
  },
  isRole: (obj, roleId) => {
    return obj.roles.find((item) => +item.id === +roleId);
  },
};
