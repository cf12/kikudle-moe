import styles from "./Nav.module.scss";
import { IoIosInformationCircle } from "react-icons/io";

export default function Nav() {
  return (
    <nav className={styles.container}>
      <div className={styles.containerInner}>
        <IoIosInformationCircle />

        <h1 className={styles.center}>Kikudle</h1>

        <IoIosInformationCircle />
      </div>
    </nav>
  );
}
