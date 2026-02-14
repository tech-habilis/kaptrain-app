import { supabase } from "@/utilities/supabase"
import { File } from "expo-file-system"

const BUCKET_NAME = "user-avatars"

// Helper to generate unique filename
const generateFileName = (userId: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${userId}/${timestamp}-${random}`
}

/**
 * Upload a profile image to Supabase storage
 * @param userId - User ID for folder organization
 * @param uri - Local URI of the image to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadProfileImage(
  userId: string,
  uri: string
): Promise<string> {
  try {
    // Get file info from URI
    const uriParts = uri.split(".")
    const fileExt = uriParts[uriParts.length - 1]
    const fileName = `${generateFileName(userId)}.${fileExt}`

    // Read file bytes using new expo-file-system API
    const file = new File(uri)
    const bytes = await file.bytes()

    // Determine content type
    const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`

    // Upload to Supabase Storage with ArrayBuffer
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, bytes.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: contentType,
      })

    if (error) {
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}

/**
 * Delete a profile image from Supabase storage
 * @param url - Public URL of the image to delete
 */
export async function deleteProfileImage(url: string): Promise<void> {
  try {
    // Extract path from URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const bucketIndex = pathParts.findIndex((part) => part === BUCKET_NAME)

    if (bucketIndex === -1) {
      throw new Error("Invalid storage URL")
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting profile image:", error)
    throw error
  }
}
