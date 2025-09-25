import Link from "next/link";
import styles from "./Buttons.module.css";

export default function Login() {
  return (
    <Link href="/loginpage">
      <button className={styles.signin}>Log In</button>
    </Link>
  );
}
