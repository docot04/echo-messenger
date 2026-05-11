import type { TranslationKeys } from "@/locales";
import { authUser, registerUser } from "../api";
import { generateEncryptedKeyPair, decryptPrivateKey } from "../keys";

type Translate = (key: TranslationKeys) => string;
type Alert = (message: string, type?: "success" | "error") => void;

type AuthLogin = (params: {
  token: string;
  userId: string;
  privateKey: CryptoKey;
}) => Promise<void>;

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  t: Translate;
  pushAlert: Alert;
  login: AuthLogin;
};

type AuthUserParams = {
  email: string;
  password: string;
  t: Translate;
  pushAlert: Alert;
  login: AuthLogin;
};

// register user
export const registerUserService = async ({
  name,
  email,
  password,
  confirmPassword,
  t,
  pushAlert,
  login,
}: RegisterUserParams) => {
  try {
    // check input fields
    if (!name || !email || !password || !confirmPassword)
      throw new Error(t("alert.fill_fields"));
    if (password !== confirmPassword)
      throw new Error(t("alert.password_mismatch"));

    // generate key pairs
    const keys = await generateEncryptedKeyPair(password);

    // TODO: IF BACKEND REJECTS REGISTRATION
    // api call
    const data = await registerUser({ name, email, password, ...keys });

    // decrypt private key locally
    const privateKey = await decryptPrivateKey({
      password,
      encryptedPrivateKey: keys.encryptedPrivateKey,
      encryptedPrivateKeySalt: keys.encryptedPrivateKeySalt,
      encryptedPrivateKeyIV: keys.encryptedPrivateKeyIV,
    });

    // save login state
    await login({
      token: data.token,
      userId: data._id,
      privateKey,
    });

    pushAlert(t("alert.registration_success"), "success");
    return data;

    // error handling
  } catch (error) {
    const message =
      error instanceof Error ? error.message : t("alert.registration_failed");
    pushAlert(message, "error");
    throw error;
  }
};

// auth user
export const authUserService = async ({
  email,
  password,
  t,
  pushAlert,
  login,
}: AuthUserParams) => {
  try {
    // check input fields
    if (!email || !password) throw new Error(t("alert.fill_fields"));

    // api call
    const data = await authUser({ email, password });

    // decrypt private key locally
    const privateKey = await decryptPrivateKey({
      password,
      encryptedPrivateKey: data.encryptedPrivateKey,
      encryptedPrivateKeySalt: data.encryptedPrivateKeySalt,
      encryptedPrivateKeyIV: data.encryptedPrivateKeyIV,
    });

    // save login state
    await login({
      token: data.token,
      userId: data._id,
      privateKey,
    });

    pushAlert(t("alert.login_success"), "success");
    return data;

    // error handling
  } catch (error) {
    const message =
      error instanceof Error ? error.message : t("alert.login_failed");
    pushAlert(message, "error");
    throw error;
  }
};
