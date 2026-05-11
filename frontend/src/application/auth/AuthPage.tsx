import React, { useState } from "react";
import { SlidingDiv, InputBox, Button, Typography } from "@/components/ui";
import { useLanguage, useAuth, useAlert } from "@/context";
import { registerUserService, authUserService } from "@/services";

export const AuthPage = () => {
  const [signup, setSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { pushAlert } = useAlert();
  const { t } = useLanguage();

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (signup)
        await registerUserService({
          name,
          email,
          password,
          confirmPassword,
          t,
          pushAlert,
          login,
        });
      else
        await authUserService({
          email,
          password,
          t,
          pushAlert,
          login,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="authpage" onSubmit={handleSubmit}>
      <Typography
        text={t("echo")}
        glitch
        bordered
        className="auth-title"
        mono
      />
      <Typography
        reveal
        text={signup ? t("auth.signup") : t("auth.login")}
        shadow
      />
      <SlidingDiv
        direction={signup ? "up" : "down"}
        key={signup ? "signup" : "login"}
      >
        <div className="authbox">
          <div className="fields">
            {signup && (
              <InputBox
                disabled={loading}
                label={t("auth.username")}
                type="text"
                width="100%"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <InputBox
              disabled={loading}
              label={t("auth.email")}
              type="email"
              width="100%"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              disabled={loading}
              label={t("auth.password")}
              type="password"
              width="100%"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {signup && (
              <InputBox
                disabled={loading}
                label={t("auth.confirm_password")}
                type="password"
                width="100%"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
          </div>
          <Button
            type="submit"
            box
            disabled={loading}
            arrow="none"
            text={signup ? t("auth.signup") : t("auth.login")}
            height="2.5rem"
            width="calc(100% - 1rem)"
          />
          <p className="switch" onClick={() => setSignup((prev) => !prev)}>
            {signup
              ? "Already have an account? Login instead"
              : "Signup instead?"}
          </p>
        </div>
      </SlidingDiv>
    </form>
  );
};
