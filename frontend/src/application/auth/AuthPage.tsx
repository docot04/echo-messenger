import { useState } from "react";
import { SlidingDiv, InputBox, Button, Typography } from "@/components/ui";
import { useLanguage } from "@/context";

export const AuthPage = () => {
  const [signup, setSignup] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="authpage">
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
              <InputBox label={t("auth.email")} type="email" width="100%" />
            )}
            <InputBox label={t("auth.username")} type="text" width="100%" />
            <InputBox label={t("auth.password")} type="password" width="100%" />
            {signup && (
              <InputBox
                label={t("auth.confirm_password")}
                type="password"
                width="100%"
              />
            )}
          </div>
          <Button
            box
            text={signup ? t("auth.signup") : t("auth.login")}
            height="3rem"
            width="calc(100% - 1rem)"
          />
          <p className="switch" onClick={() => setSignup((prev) => !prev)}>
            {signup
              ? "Already have an account? Login instead"
              : "Signup instead?"}
          </p>
        </div>
      </SlidingDiv>
    </div>
  );
};
