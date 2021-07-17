import { auth, googleProvider } from "@lib/firebase";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "@lib/useForm";

export function LoginRegister() {
  const [loginSection, setLoginSection] = useState(true);
  const [values, handleChange] = useForm({
    email: "",
    password: "",
    username: "",
  });

  const [signIn, signInHandleChange] = useForm({
    email: "",
    password: "",
  });

  const emailSignUp = async () => {
    await auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        auth.currentUser.updateProfile({
          displayName: values.username,
        });
        auth.signOut();
        auth.signInWithEmailAndPassword(values.email, values.password);
      });
  };

  const emailLogin = async () => {
    await auth.signInWithEmailAndPassword(signIn.email, signIn.password);
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="auth__card">
          {loginSection ? (
            <>
              {/* left-section */}
              <div className="auth__card__left">
                <div className="auth__card__left__head">
                  <Image
                    src="https://via.placeholder.com/50"
                    width="50"
                    height="50"
                    alt=""
                  />
                  <span>Daily poisson</span>
                </div>
                <div className="auth__card__left__content">
                  <h1>CHALLENGE THE BEST </h1>
                  <h1>OF YOURSELF EVERYDAY</h1>
                  <span>Bring out your hidden gems</span>
                </div>
                <div className="auth__card__left__footer">
                  <span>dont have an account </span>
                  <button onClick={() => setLoginSection(false)}>
                    register Now
                  </button>
                </div>
              </div>
              {/* end-left-section */}
              {/* right-section */}
              <div className="auth__card__right">
                <div className="auth__card__right__login">
                  <div className="auth__card__right__head">
                    <h1>WELCOME</h1>
                    <input
                      type="text"
                      name="email"
                      value={signIn.email}
                      onChange={signInHandleChange}
                      placeholder="email"
                    />
                    <input
                      type="password"
                      name="password"
                      value={signIn.password}
                      onChange={signInHandleChange}
                      placeholder="password"
                    />
                    <button onClick={emailLogin}>Login</button>
                  </div>
                  <div className="auth__card__right__footer">
                    <h5>login with social media</h5>
                    <div>
                      <GoogleLoginButton />
                    </div>
                  </div>
                </div>
              </div>
              {/* end-right-section */}
            </>
          ) : (
            <>
              <button onClick={() => setLoginSection(true)}>
                Alreday have an account
              </button>
              {/* right-section */}
              <div>
                <h1>Create Accout</h1>
                <input
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  placeholder="username"
                />
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="password"
                />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="email"
                />
                <button onClick={emailSignUp}>sign up</button>
              </div>
              {/* end-right-section */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {}

function GoogleLoginButton() {
  const googleLoginHandle = async () => {
    await auth.signInWithRedirect(googleProvider);
  };
  return <button onClick={googleLoginHandle}>Google</button>;
}

export function LogoutButton() {
  return <button onClick={() => auth.signOut()}>Logout</button>;
}
