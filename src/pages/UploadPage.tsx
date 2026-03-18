import { useCallback, useEffect, useRef, useState } from "react";

const ACCEPT = "image/*,video/*";

function isImageOrVideo(file: File): boolean {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export default function UploadPage(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const revokePreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const setFileWithPreview = useCallback(
    (newFile: File | null) => {
      revokePreview();
      setFile(newFile);
      setPreviewUrl(newFile ? URL.createObjectURL(newFile) : null);
    },
    [revokePreview]
  );

  useEffect(() => {
    return () => revokePreview();
  }, [revokePreview]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const first = e.dataTransfer.files[0];
      if (first && isImageOrVideo(first)) setFileWithPreview(first);
    },
    [setFileWithPreview]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleZoneClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = e.target.files?.[0];
      if (chosen && isImageOrVideo(chosen)) setFileWithPreview(chosen);
      e.target.value = "";
    },
    [setFileWithPreview]
  );

  const handleClear = useCallback(() => {
    setFileWithPreview(null);
  }, [setFileWithPreview]);

  return (
    <div className="max-w-xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Upload media</h2>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleInputChange}
          aria-label="Choose image or video"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={handleZoneClick}
          onKeyDown={(e) => e.key === "Enter" && handleZoneClick()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragOver
              ? "border-sky-500 bg-sky-50"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
          }`}
        >
          {file ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">{file.name}</p>
              {file.type.startsWith("image/") && previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              )}
              {file.type.startsWith("video/") && previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="mx-auto max-h-64 w-full rounded-lg"
                />
              )}
            </div>
          ) : (
            <p className="text-slate-500">
              Drop an image or video here, or click to choose
            </p>
          )}
        </div>

        {file && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
