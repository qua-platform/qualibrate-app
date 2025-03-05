import styles from "./ToggleSwitch.module.scss";

interface IToggleSwitchProps {
  title: string;
  activeTab: string;
  setActiveTab: (a: string) => void;
}

const ToggleSwitch = ({ title, activeTab, setActiveTab }: IToggleSwitchProps) => {
  return (
    <div className={styles.firstRowWrapper}>
      <h1>{title}</h1>
      <div className={styles.switchWrapper}>
        <div className={`${styles.switchOption} ${activeTab === "live" ? styles.active : ""}`} onClick={() => setActiveTab("live")}>
          Live
        </div>
        <div className={`${styles.switchOption} ${activeTab === "final" ? styles.active : ""}`} onClick={() => setActiveTab("final")}>
          Final
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
