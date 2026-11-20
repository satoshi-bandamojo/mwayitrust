import { useEffect, useId, useState } from 'react'
import { ImagePlus, Upload } from 'lucide-react'
import {
  ACCEPTED_CONTENT_IMAGE_TYPES,
  getContentImageValidationError,
  MAX_CONTENT_IMAGE_SIZE,
} from '../../services/contentImages.ts'

type AdminImageUploadProps = {
  label: string
  imageUrl?: string
  file: File | null
  onChange: (file: File | null) => void
  required?: boolean
  disabled?: boolean
}

export default function AdminImageUpload({
  label,
  imageUrl,
  file,
  onChange,
  required = false,
  disabled = false,
}: AdminImageUploadProps) {
  const inputId = useId()
  const errorId = useId()
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    event.target.value = ''
    if (!selectedFile) return

    const validationError = getContentImageValidationError(selectedFile)
    if (validationError) {
      setError(validationError)
      onChange(null)
      return
    }

    setError('')
    onChange(selectedFile)
  }

  const visibleImage = previewUrl || imageUrl

  return (
    <div className="admin-image-upload">
      <div className="admin-image-upload__heading">
        <label className="admin-image-upload__label" htmlFor={inputId}>
          {label}{required ? ' *' : ''}
        </label>
        <span className="admin-image-upload__hint">
          JPG, PNG, WebP, or GIF · Max {MAX_CONTENT_IMAGE_SIZE / (1024 * 1024)} MB
        </span>
      </div>

      <label className={`admin-image-upload__dropzone ${disabled ? 'is-disabled' : ''}`} htmlFor={inputId}>
        {visibleImage ? (
          <img className="admin-image-upload__preview" src={visibleImage} alt={`${label} preview`} />
        ) : (
          <span className="admin-image-upload__placeholder">
            <ImagePlus size={24} aria-hidden="true" />
            <span>No image selected</span>
          </span>
        )}
        <span className="admin-image-upload__choose">
          <Upload size={16} aria-hidden="true" />
          {file ? 'Choose a different image' : imageUrl ? 'Replace image' : 'Choose image'}
        </span>
        <input
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          accept={ACCEPTED_CONTENT_IMAGE_TYPES}
          disabled={disabled}
          onChange={handleFileChange}
          type="file"
        />
      </label>

      {error ? <p className="admin-image-upload__error" id={errorId} role="alert">{error}</p> : null}
    </div>
  )
}
