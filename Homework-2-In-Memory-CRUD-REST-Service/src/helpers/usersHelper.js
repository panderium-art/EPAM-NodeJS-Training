export const sortUsersByLogin = users => users.sort((a, b) => a.login.localeCompare(b.login));
