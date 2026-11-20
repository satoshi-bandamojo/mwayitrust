import { supabase, hasSupabaseConfig } from './supabase.ts'

export type ContentImageBucket = 'stories' | 'events' | 'gallery'

const imageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const MAX_CONTENT_IMAGE_SIZE = 1024 * 1024
export const ACCEPTED_CONTENT_IMAGE_TYPES = Object.keys(imageExtensions).join(',')

export function getContentImageValidationError(file: File): string | null {
  if (!imageExtensions[file.type]) {
    return 'Choose a JPG, PNG, WebP, or GIF image.'
  }

  if (file.size > MAX_CONTENT_IMAGE_SIZE) {
    return 'Image must be 1 MB or smaller.'
  }

  return null
}

export async function uploadContentImage(bucket: ContentImageBucket, file: File): Promise<string> {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured, so images cannot be uploaded.')
  }

  const validationError = getContentImageValidationError(file)
  if (validationError) {
    throw new Error(validationError)
  }

  const extension = imageExtensions[file.type]
  const path = `${crypto.randomUUID()}.${extension}`
  const storage = supabase.storage.from(bucket)
  const { data, error } = await storage.upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  })

  if (error) throw error

  const { data: publicUrlData } = storage.getPublicUrl(data.path)
  return publicUrlData.publicUrl
}

export async function deleteContentImage(bucket: ContentImageBucket, publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${bucket}/`
  const encodedPath = publicUrl.split(marker)[1]?.split('?')[0]
  if (!encodedPath) return

  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured, so stored images cannot be deleted.')
  }

  const path = decodeURIComponent(encodedPath)
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
