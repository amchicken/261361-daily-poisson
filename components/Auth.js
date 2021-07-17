import { auth, googleProvider } from "@lib/firebase";
import Image from "next/image";

export function LoginRegister() {
  return (
    <div>
      <div>
        <div>
          <div>
            <Image
              src="https://via.placeholder.com/50"
              width="50"
              height="50"
              alt=""
            />
            <h2>Logo Daly poisson</h2>
          </div>
          <div>
            <h3>Challenge the best of yourself everyday</h3>
            <span>dont hide your hidieen</span>
          </div>
          <div>
            <span>dont have an account </span>
            <button>register Now</button>
          </div>
        </div>
        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

function GoogleLoginButton() {
  const googleLoginHandle = async () => {
    await auth.signInWithRedirect(googleProvider);
  };
  return <button onClick={googleLoginHandle}>Google</button>;
}

export function LogoutButton() {
  return <button onClick={() => auth.signOut()}>Logout</button>;
}
