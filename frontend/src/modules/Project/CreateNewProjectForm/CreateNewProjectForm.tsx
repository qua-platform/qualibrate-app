import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./CreateNewProjectForm.module.scss";
import InputField from "../../../common/ui-components/common/Input/InputField";
// import PlusSignSquareIcon from "../../../ui-lib/Icons/PlusSignSquareIcon";
// import XIcon from "../../../ui-lib/Icons/XIcon";

// interface Member {
//   name: string;
//   email: string;
// }

interface CreateNewProjectPanelPropsDTO {
  onCancel: () => void;
}

const CreateNewProjectForm: React.FC<CreateNewProjectPanelPropsDTO> = ({ onCancel }) => {
  const [dataPath, setDataPath] = useState("");
  const [quamPath, setQuamPath] = useState("");
  const [calibrationPath, setCalibrationPath] = useState("");
  // const [memberEmail, setMemberEmail] = useState("");
  // const [memberName, setMemberName] = useState("");
  // const [members, setMembers] = useState<Member[]>([]);

  // const addMember = () => {
  //   if (memberEmail && memberName && !members.some(m => m.email === memberEmail)) {
  //     setMembers([...members, { name: memberName, email: memberEmail }]);
  //     setMemberEmail("");
  //     setMemberName("");
  //   }
  // };

  // const removeMember = (email: string) => {
  //   setMembers(members.filter((m) => m.email !== email));
  // };

  const handleCancel = () => {
    setDataPath("");
    setQuamPath("");
    setCalibrationPath("");
    // setMemberEmail("");
    // setMemberName("");
    // setMembers([]);
    onCancel();
  };
  
  const handleCreate = () => {
    // Placeholder for backend integration
  };

  return (
    <div className={styles.createProjectPanel}>
      <h3 className={styles.header}>Create New Project</h3>

      <label>Data path</label>
      <InputField type="text" placeholder="Enter data path" value={dataPath} onChange={(val: string) => setDataPath(val)} />

      <label>QUAM state path</label>
      <InputField type="text" placeholder="Enter QUAM path" value={quamPath} onChange={(val: string) => setQuamPath(val)} />

      <label>Calibration library path</label>
      <InputField type="text" placeholder="Enter calibration path" value={calibrationPath} onChange={(val: string) => setCalibrationPath(val)} />

      {/* <label>Members <span className={styles.optional}>– optional</span> </label>
      <div className={styles.memberInputWrapper}>
        <div className={styles.memberInputFields}>
          <InputField type="text" placeholder="Member name" value={memberName} onChange={(val: string) => setMemberName(val)} />
          <InputField type="email" placeholder="Member email" value={memberEmail} onChange={(val: string) => setMemberEmail(val)} />
        </div>
        <button type="button" onClick={addMember} className={styles.plusButton} title="Add member" disabled={!memberName || !memberEmail}>
            <PlusSignSquareIcon />
        </button>
      </div>

      <div className={styles.chips}>
        {members.map((member) => (
          <span key={member.email} title={member.email} className={styles.chip}>
            {member.name}
            <span onClick={() => removeMember(member.email)}> <XIcon /> </span>
          </span>
        ))}
      </div> */}

      <div className={styles.actions}>
        <button onClick={handleCancel} className={styles.cancel}>Cancel</button>
        <button onClick={handleCreate} className={styles.create}>Create</button>
      </div>
    </div>
  );
};

export default CreateNewProjectForm;
