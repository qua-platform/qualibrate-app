import React, { useState } from "react";
import styles from "./CreateNewProjectPanel.module.scss";
import PlusSignSquareIcon from "../../../ui-lib/Icons/PlusSignSquareIcon";
import XIcon from "../../../../src/ui-lib/Icons/XIcon";

interface Member {
  name: string;
  email: string;
}
  interface Props {
    onCancel: () => void;
  }
const CreateNewProjectPanel: React.FC<Props> = ({ onCancel }) => {
  const [dataPath, setDataPath] = useState("");
  const [quamPath, setQuamPath] = useState("");
  const [calibrationPath, setCalibrationPath] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = () => {
    if (memberEmail && memberName && !members.some(m => m.email === memberEmail)) {
      setMembers([...members, { name: memberName, email: memberEmail }]);
      setMemberEmail("");
      setMemberName("");
    }
  };

  const removeMember = (email: string) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const handleCancel = () => {
    setDataPath("");
    setQuamPath("");
    setCalibrationPath("");
    setMemberEmail("");
    setMemberName("");
    setMembers([]);
    onCancel();
  };
  
  const handleCreate = () => {
    console.log({ dataPath, quamPath, calibrationPath, members });
    // Placeholder for backend integration
  };

  return (
    <div className={styles.createProjectPanel}>
      <h3 className={styles.header}>Create New Project</h3>

      <label>Data path</label>
      <input type="text" placeholder="Enter data path" value={dataPath} onChange={(e) => setDataPath(e.target.value)} />

      <label>QUAM state path</label>
      <input type="text" placeholder="Enter QUAM path" value={quamPath} onChange={(e) => setQuamPath(e.target.value)} />

      <label>Calibration library path</label>
      <input type="text" placeholder="Enter calibration path" value={calibrationPath} onChange={(e) => setCalibrationPath(e.target.value)} />

      <label>
        Members <span className={styles.optional}>– optional</span>
      </label>
      <div className={styles.memberInputWrapper}>
        <div className={styles.memberInputFields}>
          <input type="text" placeholder="Member name" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
          <input type="email" placeholder="Member email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
        </div>
        <button type="button" onClick={addMember} className={styles.plusButton} title="Add member"> <PlusSignSquareIcon /> </button>
      </div>

      <div className={styles.chips}>
        {members.map((member) => (
          <span key={member.email} title={member.email} className={styles.chip}>
            {member.name}
            <span onClick={() => removeMember(member.email)}> <XIcon /> </span>
          </span>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={handleCancel} className={styles.cancel}>Cancel</button>
        <button onClick={handleCreate} className={styles.create}>Create</button>
      </div>
    </div>
  );
};

export default CreateNewProjectPanel;
