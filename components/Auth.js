import {
    auth,
    googleProvider,
    facebookProvider,
    firestore,
} from "@lib/firebase";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { SocialIcon } from "react-social-icons";
import { useForm } from "@lib/useForm";
import toast from "react-hot-toast";

export function LoginRegister() {
    const [loginSection, setLoginSection] = useState(true);
    const [iconHeight, setIconHeight] = useState(30);
    const [iconWidth, setIconWidth] = useState(30);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    const [values, handleChange] = useForm({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });

    const [signIn, signInHandleChange] = useForm({
        email: "",
        password: "",
    });

    const emailSignUp = async () => {
        if (values.password !== values.confirmPassword) {
            ////// ALERT SOMETHING
            toast.error("password does not match");
            return;
        }

        if (values.username === "") {
            toast.error("username can't be null");
            return;
        }

        if (values.password === "") {
            toast.error("password can't be null");
            return;
        }

        if (values.email === "") {
            toast.error("email can't be null");
            return;
        }

        await auth
            .createUserWithEmailAndPassword(values.email, values.password)
            .then(() => {
                const batch = firestore.batch();
                batch.set(
                    firestore.collection("usernames").doc(auth.currentUser.uid),
                    {
                        name: values.username,
                        username: values.username,
                        email: values.email,
                        photoURL: null,
                        bio: "",
                        dayStreak: 0,
                        accepted: 0,
                        points: 0,
                        rewards: 0,
                    }
                );
                batch.commit();
            })
            .catch((err) => toast.error(err.message));
    };

    const emailLogin = async () => {
        await auth
            .signInWithEmailAndPassword(signIn.email, signIn.password)
            .catch((err) => {
                console.log(err.message);
                toast.error(err.message);
                return;
            });
    };

    const loginCard = useRef();
    const registerCard = useRef();

    const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    useEffect(async () => {
        if (loginCard.current != null) {
            loginCard.current.style.opacity = 1;
        }
        if (registerCard.current != null) {
            registerCard.current.style.opacity = 1;
        }
    }, [loginSection]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 950 || window.innerHeight <= 550) {
                setIconWidth(20);
                setIconHeight(20);
            } else {
                setIconWidth(30);
                setIconHeight(30);
            }
        }
        window.addEventListener("resize", handleResize);
    });

    return (
        <div className="auth-background">
            <div className="auth-container">
                {loginSection ? (
                    <div className="auth__card" ref={loginCard}>
                        {/* left-section */}
                        <div className="auth__card__left">
                            <div className="auth__card__left__head">
                                <Image
                                    src="/img/logo.png"
                                    width="90"
                                    height="64"
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
                                <span>DON&apos;T HAVE AN ACCOUNT</span>
                                <button
                                    onClick={async () => {
                                        loginCard.current.style.opacity = 0;
                                        await sleep(1000);
                                        setLoginSection(false);
                                    }}
                                >
                                    Register Now
                                </button>
                            </div>
                        </div>
                        {/* end-left-section */}
                        {/* right-section */}
                        <div className="auth__card__right">
                            <div className="auth__card__right__login">
                                <div className="auth__card__right__head">
                                    <h1>WELCOME</h1>
                                    <div>
                                        <input
                                            type="text"
                                            name="email"
                                            value={signIn.email}
                                            onChange={signInHandleChange}
                                        />
                                        <label htmlFor="email">email</label>
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={signIn.password}
                                            onChange={signInHandleChange}
                                        />
                                        <label htmlFor="password">
                                            password
                                        </label>
                                    </div>
                                    <button onClick={emailLogin}>login</button>
                                    <span>forgot password</span>
                                </div>
                                <div className="auth__card__right__footer">
                                    <h5>login with social media</h5>
                                    <div>
                                        <button
                                            onClick={async () => {
                                                await auth.signInWithRedirect(
                                                    facebookProvider
                                                );
                                            }}
                                        >
                                            <SocialIcon
                                                network="facebook"
                                                bgColor="#33ccff"
                                                fgColor="white"
                                                style={{
                                                    height: iconHeight,
                                                    width: iconWidth,
                                                }}
                                            />
                                        </button>
                                        <button>
                                            <SocialIcon
                                                network="twitter"
                                                style={{
                                                    height: iconHeight,
                                                    width: iconWidth,
                                                }}
                                            />
                                        </button>
                                        <GoogleLoginButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end-right-section */}
                    </div>
                ) : (
                    <div className="auth__card" ref={registerCard}>
                        <div className="auth__card__left">
                            <div className="auth__card__left__head">
                                <Image
                                    src="/img/logo.png"
                                    width="90"
                                    height="64"
                                    alt=""
                                />
                                <span>Daily poisson</span>
                            </div>
                            <div className="auth__card__left__content">
                                <button
                                    onClick={async () => {
                                        registerCard.current.style.opacity = 0;
                                        await sleep(1000);
                                        setLoginSection(true);
                                    }}
                                >
                                    Already have an account
                                </button>
                                <div></div>
                            </div>
                        </div>
                        {/* right-section */}
                        <div className="auth__card__right">
                            <div className="auth__card__right__head">
                                <h2>CREATE ACCOUNT</h2>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="email">email</label>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="username">username</label>
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="password">password</label>
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="confirmPassword">
                                        confirm password
                                    </label>
                                </div>
                                <button onClick={emailSignUp}>sign up</button>
                            </div>
                        </div>
                        {/* end-right-section */}
                    </div>
                )}
            </div>
        </div>
    );
}

function RegisterForm() {}

function GoogleLoginButton() {
    const googleLoginHandle = async () => {
        await auth
            .signInWithRedirect(googleProvider)
            .then(toast.success("Successfully login"));
    };
    return (
        <button onClick={googleLoginHandle}>
            <FcGoogle
                style={{ position: "relative", top: "5px", right: "2px" }}
            />
        </button>
    );
}

export function LogoutButton() {
    return (
        <button
            onClick={() => {
                auth.signOut().then(toast.success("Successfully logout"));
            }}
        >
            Logout
        </button>
    );
}
