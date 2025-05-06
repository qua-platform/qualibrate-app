import React, { useState, useEffect } from "react";
import styles from "./styles/FeedbackModal.module.scss";
import SuccessToast from "../toastModule/SuccessToast";

interface FeedbackModalProps {
  onClose: () => void;
}

interface FeedbackDraft {
  summary: string;
  detail: string;
  feedbackType: string;
  customType: string;
  attachments: {
    url: string;
    name: string;
    size: number;
  }[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [closing, setClosing] = useState(false);
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [draftAttachments, setDraftAttachments] = useState<FeedbackDraft["attachments"]>([]);
  const [feedbackType, setFeedbackType] = useState("Bug Report");
  const [customType, setCustomType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canSubmit = summary.trim() !== "" || detail.trim() !== "";

  const MAX_FILES = 4;
  const MAX_FILE_SIZE_MB = 5;

  // Save draft to localStorage
  const saveDraft = () => {
    const draft: FeedbackDraft = {
      summary,
      detail,
      feedbackType,
      customType,
      attachments: attachments.map((file, i) => ({
        url: previewUrls[i],
        name: file.name,
        size: file.size,
      })),
    };
    localStorage.setItem("feedback_draft", JSON.stringify(draft));
  };

  // Load draft from localStorage
  const loadDraft = () => {
    const draftString = localStorage.getItem("feedback_draft");
    if (draftString) {
      const draft: FeedbackDraft = JSON.parse(draftString);
      setSummary(draft.summary || "");
      setDetail(draft.detail || "");
      setFeedbackType(draft.feedbackType || "Bug Report");
      setCustomType(draft.customType || "");
      if (draft.attachments?.length) {
        setPreviewUrls(draft.attachments.map((a) => a.url));
        setAttachments(draft.attachments.map((a) => new File([], a.name, { type: "image/*" })));
        setDraftAttachments(draft.attachments);
      }
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem("feedback_draft");
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleBackdropClick = () => {
    handleClose();
  };

  const handleSubmit = () => {
    console.log("Feedback Type:", feedbackType === "Other" ? customType : feedbackType);
    console.log("Summary:", summary);
    console.log("Detail:", detail);
    console.log("Attachments:", attachments);

    setShowToast(true);
    clearDraft();
    setTimeout(() => {
      handleClose();
    }, 800);
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (attachments.length + newFiles.length > MAX_FILES) {
      alert(`You can upload up to ${MAX_FILES} images.`);
      return;
    }

    const oversizeFile = newFiles.find((file) => file.size / (1024 * 1024) > MAX_FILE_SIZE_MB);
    if (oversizeFile) {
      alert(`File too large! Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setAttachments((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newDraftAttachments = draftAttachments.filter((_, i) => i !== index);

    setAttachments(newAttachments);
    setPreviewUrls(newPreviews);
    setDraftAttachments(newDraftAttachments);

    const draft: FeedbackDraft = {
      summary,
      detail,
      feedbackType,
      customType,
      attachments: newDraftAttachments,
    };
    localStorage.setItem("feedback_draft", JSON.stringify(draft));
  };

  const formatFileName = (name: string) => {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  const formatFileSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return `${sizeInMB.toFixed(1)} MB`;
  };

  useEffect(() => {
    loadDraft();
  }, []);

  useEffect(() => {
    if (summary || detail || previewUrls.length > 0 || feedbackType !== "Bug Report" || customType) {
      saveDraft();
    }
  }, [summary, detail, feedbackType, customType, previewUrls]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <div
          className={`${styles.modal} ${closing ? styles.closing : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Feedback</h2>

          {/* Summary + Feedback Type on the same line */}
          <div className={styles.summaryAndTypeWrapper}>
            <input
              type="text"
              placeholder="Summary"
              className={styles.input}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <select
              className={styles.select}
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>UI/UX Feedback</option>
              <option>Performance Issue</option>
              <option>Other</option>
            </select>
          </div>

          {/* Custom type if "Other" selected */}
          {feedbackType === "Other" && (
            <input
              type="text"
              placeholder="Custom feedback type"
              className={styles.input}
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
            />
          )}

          {/* Detail */}
          <textarea
            placeholder="Detail"
            className={styles.textarea}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />

          {/* Images */}
          <div className={styles.fileInputWrapper}>
            {attachments.length === 0 && (
              <label
                className={`${styles.fileLabel} ${isDragging ? styles.dragActive : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                Attach images (optional):<br />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <span className={styles.dragHint}>
                  {isDragging ? "Drop images here..." : "Click or drag images"}
                </span>
              </label>
            )}

            {previewUrls.length > 0 && (
              <div className={styles.previewGrid}>
                {previewUrls.map((url, index) => (
                  <div key={index} className={styles.previewWrapper}>
                    <img src={url} alt={`Attachment ${index + 1}`} className={styles.previewImage} />
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                    <div className={styles.fileName}>
                      {attachments[index]?.name
                        ? `${formatFileName(attachments[index].name)} (${formatFileSize(attachments[index].size)})`
                        : draftAttachments[index]
                        ? `${formatFileName(draftAttachments[index].name)} (${formatFileSize(draftAttachments[index].size)})`
                        : formatFileName("Image")}
                    </div>
                  </div>
                ))}

                {previewUrls.length < MAX_FILES && (
                  <label
                    className={`${styles.previewWrapper} ${styles.addMore}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                    <div className={styles.plusSign}>+</div>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={styles.buttonRow}>
            <button className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <SuccessToast
          message="Thank you for your feedback!"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default FeedbackModal;
