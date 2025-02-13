import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../RunningJob/RunningJob.module.scss";
import { Tooltip } from "@mui/material";

export const ValueComponent = ({
  stateUpdateValue,
  disabled,
  onClick,
  onChange,
}: {
  stateUpdateValue: string | number;
  disabled?: boolean;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isHovered, setIsHovered] = useState<boolean | undefined>(false);
  const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const adjustWidth = useCallback(() => {
    if (inputRef.current) {
      const value = stateUpdateValue.toString() || "";
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = getComputedStyle(inputRef.current).font;
        const textWidth = context.measureText(value).width;
        inputRef.current.style.width = `${Math.ceil(textWidth)}px`;
      }
    }
  }, [stateUpdateValue]);

  useEffect(() => {
    adjustWidth();
  }, [stateUpdateValue, adjustWidth]);

  if (!onClick) {
    return (
      <div className={styles.valueContainer} data-testid="value-container">
        {stateUpdateValue}
      </div>
    );
  }

  return (
    <>
      <Tooltip title={`${isHovered ? tooltipText : ""}`}>
        <input
          ref={inputRef}
          className={isHovered ? styles.valueContainerHovered : disabled ? styles.valueContainerDisabled : styles.valueContainerEditable}
          data-testid="value-input"
          onMouseEnter={() => {
            if (tooltipText === undefined) {
              setTooltipText("Edit");
            }
            setIsHovered(true);
          }}
          disabled={disabled}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setTooltipText("")}
          onBlur={(e) => {
            onChange && onChange(e);
            setTooltipText("Edit");
          }}
          defaultValue={stateUpdateValue}
        />
      </Tooltip>
    </>
  );
};
