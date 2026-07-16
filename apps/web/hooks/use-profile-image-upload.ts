"use client";

import { useMutation } from "convex/react";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useAccount } from "wagmi";

import { api } from "@/lib/convex";
import { toast } from "sonner";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function useProfileImageUpload() {
  const { address } = useAccount();
  const updateProfileImage = useMutation(api.users.updateProfileImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openPicker = useCallback(() => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !address) return;

      if (!ALLOWED_TYPES.has(file.type)) {
        const message = "Use a JPEG, PNG, WebP, or GIF image";
        setError(message);
        toast.error(message);
        return;
      }

      if (file.size > MAX_BYTES) {
        const message = "Image must be 5MB or smaller";
        setError(message);
        toast.error(message);
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setUploading(true);
      setError(null);
      const toastId = toast.loading("Uploading profile image…");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as {
          success?: boolean;
          error?: string;
          data?: { secure_url?: string };
        };

        if (!response.ok || !payload.success || !payload.data?.secure_url) {
          throw new Error(payload.error || "Upload failed");
        }

        await updateProfileImage({
          walletAddress: address,
          profileImage: payload.data.secure_url,
        });

        setPreviewUrl(payload.data.secure_url);
        toast.success("Profile image updated", { id: toastId });
      } catch (err) {
        setPreviewUrl(null);
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        toast.error(message, { id: toastId });
      } finally {
        URL.revokeObjectURL(localPreview);
        setUploading(false);
      }
    },
    [address, updateProfileImage],
  );

  return {
    inputRef,
    uploading,
    error,
    previewUrl,
    openPicker,
    onFileChange,
    configured: Boolean(address),
  };
}
