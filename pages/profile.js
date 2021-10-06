import { useState, useContext, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { useForm } from "@lib/useForm";
import { auth, firestore } from "@lib/firebase";
import { toast } from "react-hot-toast";
import ImageUploader from "@components/ImageUploader";
import { FiCamera } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { SocialIcon } from "react-social-icons";
import Nav from "@components/Nav";

export default function ProfilePage() {
    const { user } = useContext(UserContext);
    const [values, onChange] = useForm({
        bio: user.bio,
        name: user.name,
        username: user.username,
        photoURL: user.photoURL,
    });

    const [left, setLeft] = useState(true);

    const onSubmit = async () => {
        const ref = firestore.collection("usernames").doc(auth.currentUser.uid);
        const batch = firestore.batch();
        batch.update(ref, {
            name: values.name,
            bio: values.bio,
            username: values.username,
            photoURL: values.photoURL,
        });
        batch.commit().then(() => {
            toast.success("update profile success");
        });
    };

    const selectedStyle = {
        borderBottom: "2px solid rgb(226, 7, 226)",
    };

    const [iconHeight, setIconHeight] = useState(30);
    const [iconWidth, setIconWidth] = useState(30);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

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
        <div className="container">
            <Nav />
            <div className="container3">
                <div className="container3__left">
                    <div className="container3__left__header">
                        <div>
                            <div>{user.username}</div>
                            <span>RANKING: 69696969</span>
                        </div>
                        <box>
                            <textarea
                                type="text"
                                name="bio"
                                value={values.bio}
                                onChange={onChange}
                                placeholder="TELL US SOMETHING ABOUT YOU"
                            />
                        </box>
                    </div>
                    <div className="container3__left__content">
                        <div className="container3__left__content__header">
                            <div
                                onClick={() => setLeft(true)}
                                style={left ? selectedStyle : {}}
                            >
                                Activities
                            </div>
                            <div
                                onClick={() => setLeft(false)}
                                style={!left ? selectedStyle : {}}
                            >
                                Account setting
                            </div>
                            <div></div>
                        </div>
                        <div className="container3__left__content__content">
                            {left ? (
                                <div className="container3__left__content__content__activity">
                                    <div>{user.accepted}</div>
                                    <span>ACCEPTED</span>
                                    <div>{user.dayStreak}</div>
                                    <span>DAY STREAK</span>
                                    <div>{user.points}</div>
                                    <span>POINTS</span>
                                    <div>{user.rewards}</div>
                                    <span>REWARDS</span>
                                </div>
                            ) : (
                                <div className="container3__left__content__content__account">
                                    <div className="container3__left__content__content__account__top">
                                        <div>
                                            <span>NAME</span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={onChange}
                                                placeholder="name"
                                                disabled
                                            />
                                            <button
                                                onClick={() => enableInput()}
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                        <div>
                                            <span>
                                                <FiCamera />
                                            </span>
                                            <ImageUploader
                                                // setImgUrl={}
                                                placeholder="SET NEW PHOTO"
                                            />
                                        </div>
                                        <div>
                                            <span>EMAIL</span>
                                            <input
                                                type="text"
                                                name="email"
                                                /// email
                                                // onChange={onChange}
                                                placeholder="email"
                                                value={user.email}
                                                disabled
                                            />
                                            <button
                                                onClick={() => enableInput()}
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                        <div>
                                            <span>USERNAME</span>
                                            <input
                                                type="text"
                                                name="username"
                                                /// email
                                                // onChange={onChange}
                                                value={user.username}
                                                placeholder="username"
                                                disabled
                                            />
                                            <button
                                                onClick={() => enableInput()}
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                        <div>
                                            <span>PASSWORD</span>
                                            <a href="#">CHANGE PASSWORD</a>
                                            <button
                                                onClick={() => onSubmit()}
                                                style={{ color: "#48F36E" }}
                                            >
                                                SAVE
                                            </button>
                                        </div>
                                    </div>
                                    <div className="container3__left__content__content__account__middle">
                                        <div>SOCIAL MEDIA ACCOUNT</div>
                                        <div>
                                            <span>
                                                <SocialIcon
                                                    network="facebook"
                                                    bgColor="#33ccff"
                                                    fgColor="white"
                                                    style={{
                                                        height: iconHeight,
                                                        width: iconWidth,
                                                    }}
                                                />
                                                <text>FACEBOOK</text>
                                            </span>
                                            <span>
                                                <SocialIcon
                                                    network="twitter"
                                                    style={{
                                                        height: iconHeight,
                                                        width: iconWidth,
                                                    }}
                                                />
                                                <text>TWIITER</text>
                                            </span>
                                            <span>
                                                <FcGoogle
                                                    style={{
                                                        position: "relative",
                                                        fontSize: "2rem",
                                                    }}
                                                />
                                                <text>GOOGLE</text>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="container3__left__content__content__account__bottom">
                                        <button>DEACTIVATE ACCOUNT</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
