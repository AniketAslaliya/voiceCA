export const login = (email, name) => {
  localStorage.setItem(
    "voiceca_user",
    JSON.stringify({ email, name: name || email.split("@")[0], loggedIn: true }),
  );
};

export const logout = () => localStorage.removeItem("voiceca_user");

export const getUser = () => {
  const user = localStorage.getItem("voiceca_user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getUser();
