export const hashPassword = async (password: any) => {
  try {
    const argon2 = await import("argon2");
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error(err);
  }
};
