import styles from "./ToggleSwitch.module.scss";

interface IToggleSwitchProps {
  activeTab: string;
  setActiveTab: (a: string) => void;
}

const ToggleSwitch = ({ activeTab, setActiveTab }: IToggleSwitchProps) => {
  return (
    <div className={styles.switchWrapper}>
      <div className={`${styles.switchOption} ${activeTab === "live" ? styles.selected : ""}`} onClick={() => setActiveTab("live")}>
        Live
      </div>
      <div className={`${styles.switchOption} ${activeTab === "final" ? styles.selected : ""}`} onClick={() => setActiveTab("final")}>
        Final
      </div>
    </div>
  );
};

export default ToggleSwitch;
