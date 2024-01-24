module.exports = {
  isRole: (user, roleId) => {
    const result = user.roles.find((item) => +item.id === +roleId);
    return result ? true : false;
  },
};
