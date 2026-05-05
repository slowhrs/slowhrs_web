"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./ApplicationForm.module.css";

const FIELDS = [
  { name: "name", placeholder: "name", type: "text" },
  { name: "instagram", placeholder: "@instagram", type: "text" },
  { name: "email", placeholder: "email", type: "email" },
  { name: "city", placeholder: "city", type: "text" },
  { name: "role", placeholder: "what do you do?", type: "text" },
  { name: "contribution", placeholder: "what do you bring to the room?", type: "text" },
];

export default function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={styles.formWrap}>
      <h2 className={styles.heading}>apply</h2>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.success}
          >
            <p className={styles.successText}>received. we review weekly.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {FIELDS.map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required
                className={styles.input}
              />
            ))}
            <button type="submit" className={styles.submit}>
              request access →
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
