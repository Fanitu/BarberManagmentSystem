import { useEffect, useState } from "react";
import { getSettings, setEmailAnalysisEnabled,changeChainAdminPassword,saveTelegramPhone,setTelegramAnalysisEnabled } from "../../api/chainsettings";
import { LoadingBanner } from "../Shared/SkeletonLine";
import ChangePasswordModal from "./ChangePasswordModal";
import SuccessToast from "../Shared/SuccessToast";
import styles from "./Settings.module.css";
import TelegramPhoneModal from "./TelegramPhoneModal";

const Settings = () => {
  const [settings, setSettingsState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 const [telegramModalOpen, setTelegramModalOpen] = useState(false);
 const [savingTelegram, setSavingTelegram] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettingsState)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async () => {
    const next = !settings.emailAnalysisEnabled;
    setSaving(true);
    setSettingsState((s) => ({ ...s, emailAnalysisEnabled: next })); // optimistic
    try {
      await setEmailAnalysisEnabled(next);
    } catch (err) {
      setError(err.message);
      setSettingsState((s) => ({ ...s, emailAnalysisEnabled: !next })); // revert
    } finally {
      setSaving(false);
    }
  };

const BOT_LINK = "https://t.me/MBbarbermanagmentBot";

  const handleTelegramToggle = async () => {
    if (!settings.telegramAnalysisEnabled) {
      setTelegramModalOpen(true); // turning on -> ask for phone first
      return;
    }
    // turning off -> no phone needed
    setSettingsState((s) => ({ ...s, telegramAnalysisEnabled: false }));
    try {
      await setTelegramAnalysisEnabled(false);
    } catch (err) {
      setError(err.message);
      setSettingsState((s) => ({ ...s, telegramAnalysisEnabled: true }));
    }
  };

  const handleSaveTelegramPhone = async (phone) => {
   setSavingTelegram(true);
    try {
      await saveTelegramPhone(phone);
      setSettingsState((s) => ({ ...s, telegramAnalysisEnabled: true, telegramPhone: phone, telegramConnected: false }));
      setTelegramModalOpen(false);
      window.open(BOT_LINK, "_blank");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTelegram(false);
    }
  };

 const handleChangePassword = async ({ previousPassword, newPassword }) => {
    setChangingPassword(true);
    setPasswordError("");
    try {
      await changeChainAdminPassword(previousPassword, newPassword);
      setPasswordModalOpen(false);
      setSuccessMessage("Password changed successfully");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
   }
  };


  if (loading) return <LoadingBanner />;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Settings</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Daily Email Analysis</span>
            <p className={styles.description}>
              Get a daily breakdown of your shops' performance at {settings.email}. On Sundays
              you'll also get the week's summary, and on the last day of the month, the full
              monthly and financial analysis.
            </p>
          </div>
          <button
            className={`${styles.switch} ${settings.emailAnalysisEnabled ? styles.on : ""}`}
            onClick={toggle}
            disabled={saving}
            role="switch"
            aria-checked={settings.emailAnalysisEnabled}
          >
            <span className={styles.knob} />
          </button>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: 16 }}>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Telegram Analysis</span>
            <p className={styles.description}>
              {settings.telegramConnected
                ? "Connected — you'll also get the daily analysis on Telegram at 9:00 PM."
                : "Get the same daily analysis delivered on Telegram instead of (or alongside) email."}
            </p>
            {settings.telegramAnalysisEnabled && !settings.telegramConnected && (
              <a className={styles.onlineBtn} href={BOT_LINK} target="_blank" rel="noreferrer">
                Open Bot to Finish Linking
              </a>
            )}
          </div>
          <button
            className={`${styles.switch} ${settings.telegramAnalysisEnabled ? styles.on : ""}`}
            onClick={handleTelegramToggle}
            role="switch"
            aria-checked={settings.telegramAnalysisEnabled}
          >
            <span className={styles.knob} />
          </button>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: 16 }}>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Password</span>
            <p className={styles.description}>Change the password you use to log in to your chain admin account.</p>
          </div>
          <button className={styles.changeBtn} onClick={() => setPasswordModalOpen(true)}>
            Change Password
          </button>
        </div>
      </div>

    {telegramModalOpen && (
        <TelegramPhoneModal
          onClose={() => setTelegramModalOpen(false)}
          onSubmit={handleSaveTelegramPhone}
          submitting={savingTelegram}
        />
      )}

      {passwordModalOpen && (
        <ChangePasswordModal
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleChangePassword}
          submitting={changingPassword}
          error={passwordError}
        />
      )}

      {successMessage && (
        <SuccessToast message={successMessage} onDone={() => setSuccessMessage("")} />
      )}
    </section>
  );
};

export default Settings;