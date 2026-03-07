import { useState, useRef } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";

/**
 * ImageUploader — reusable image upload component.
 *
 * Props:
 *   onUpload(url)   — called with Cloudinary URL after successful upload
 *   label           — button/area label
 *   preview         — current image URL to show as preview (optional)
 *   compact         — if true, renders as a small inline button (for editor toolbar)
 */
export default function ImageUploader({ onUpload, label = "Upload Image", preview = null, compact = false }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const handleFile = async (file) => {
        if (!file || !file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be under 10MB.");
            return;
        }
        setError(null);
        setUploading(true);
        setProgress(0);
        try {
            const url = await uploadToCloudinary(file, setProgress);
            onUpload(url);
        } catch {
            setError("Upload failed. Check your Cloudinary config.");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    // Compact mode: just a small toolbar button
    if (compact) {
        return (
            <span>
                <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                <button
                    type="button"
                    onClick={() => inputRef.current.click()}
                    disabled={uploading}
                    title="Insert image"
                    style={{
                        background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
                        color: uploading ? "var(--text-faint)" : "var(--text-muted)",
                        borderRadius: 7, padding: "5px 10px", fontSize: 13,
                        cursor: uploading ? "not-allowed" : "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                    }}
                >
                    {uploading ? (
                        <><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "var(--blue)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />{progress}%</>
                    ) : "🖼 Image"}
                </button>
                {error && <span style={{ fontSize: 11, color: "#ef4444", marginLeft: 8 }}>{error}</span>}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </span>
        );
    }

    // Full mode: drop zone with preview
    return (
        <div>
            <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            {/* Preview */}
            {preview && (
                <div style={{ position: "relative", marginBottom: 12, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
                    <img src={preview} alt="Cover" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                    <button
                        onClick={() => onUpload(null)}
                        style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                        ✕ Remove
                    </button>
                </div>
            )}

            {/* Drop zone */}
            {!preview && (
                <div
                    onClick={() => inputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{
                        border: `2px dashed ${dragging ? "var(--blue)" : "var(--border)"}`,
                        borderRadius: 10, padding: "28px 20px", textAlign: "center",
                        cursor: "pointer", marginBottom: 8, transition: "all 0.2s",
                        background: dragging ? "rgba(74,143,212,0.06)" : "rgba(255,255,255,0.02)",
                    }}
                >
                    {uploading ? (
                        <div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Uploading... {progress}%</div>
                            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                                <div style={{ width: `${progress}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", height: "100%", borderRadius: 99, transition: "width 0.3s ease" }} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>🖼</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Drag & drop or click · Max 10MB</div>
                        </>
                    )}
                </div>
            )}

            {error && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{error}</div>}
        </div>
    );
}