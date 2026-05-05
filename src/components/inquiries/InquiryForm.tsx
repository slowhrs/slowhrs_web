"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INQUIRY_CATEGORIES } from "./inquiries.data";
import type { InquiryCategory } from "./inquiries.data";
import styles from "./InquiryForm.module.css";

export default function InquiryForm() {
  const [activeCategory, setActiveCategory] = useState<InquiryCategory>(INQUIRY_CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className={styles.formWrap}>
      {/* Category tabs */}
      <div className={styles.tabs}>
        {INQUIRY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat); setSubmitted(false); }}
            className={`${styles.tab} ${activeCategory.id === cat.id ? styles.tabActive : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeCategory.id + "-desc"}
          className={styles.description}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {activeCategory.description}
        </motion.p>
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.successText}>received. we'll be in touch.</p>
          </motion.div>
        ) : (
          <motion.form
            key={activeCategory.id}
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {activeCategory.fields.map((field) => (
              <div key={field.name} className={styles.fieldWrap}>
                <label className={styles.label} htmlFor={`${activeCategory.id}-${field.name}`}>
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={`${activeCategory.id}-${field.name}`}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className={styles.textarea}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`${activeCategory.id}-${field.name}`}
                    name={field.name}
                    required={field.required}
                    className={styles.select}
                    defaultValue=""
                  >
                    <option value="" disabled>{field.placeholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`${activeCategory.id}-${field.name}`}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={styles.input}
                  />
                )}
              </div>
            ))}

            <button type="submit" className={styles.submit}>
              send →
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
