"use client";

import React, { useState } from "react";
import styles from "@/components/ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ToggleSwitch({
  checked = false,
  onChange,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className={styles.switchContainer}>
      <label className={styles.switchWide}>
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span className={styles.sliderWide}>
          <span className={styles.showing}>Now Showing</span>
          <span className={styles.soon}>Coming Soon</span>
        </span>
      </label>
    </div>
  );
}
