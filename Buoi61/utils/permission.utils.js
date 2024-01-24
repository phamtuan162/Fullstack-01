module.exports = {
  isPermission: (role, permissionValue) => {
    const result = role.permissions.find(
      (item) => item.value === permissionValue
    );
    return result ? true : false;
  },
};
