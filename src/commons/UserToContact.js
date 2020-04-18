export const userToContact = (user) => {
    var contact = {
      id: user.userInfos._id,
      firstName: user.userInfos.firstName,
      lastName: user.userInfos.lastName,
      name: user.userInfos.fullName,
      emails: [{ email: user.userInfos.email }],
      expoToken: user.userInfos.expoToken,
      userId: user.userInfos._id,
      isLogged: user.userInfos.isLogged,
      image: { uri: user.userInfos.avatar }
    };
    return contact;
  }