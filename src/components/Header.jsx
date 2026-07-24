import styles from "./Header.module.css";

const Header = ({ user, role, onLoginClick, onLogout }) => {
  const title = role === "admin" ? "Admin Panel" : "Barber Management System";

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.authArea}>
        {user ? (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <button className={styles.loginBtn} onClick={onLoginClick}>
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
