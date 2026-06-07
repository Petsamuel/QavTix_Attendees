"use client"

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface ProfileImageUploaderProps {
    initialImage?: string | null;
    isEditing: boolean;
    onImageChange?: (file: File) => void;
    className?: string;
}

export default function ProfileImageUploader({
    initialImage,
    isEditing,
    onImageChange,
    className
}: ProfileImageUploaderProps) {

    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage ?? null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setPreviewUrl(initialImage ?? null)
    }, [initialImage])

    useEffect(() => {
        if (!isEditing) setPreviewUrl(initialImage ?? null)
    }, [isEditing, initialImage])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                alert("Unsupported file type")
                return
            }
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            if (onImageChange) onImageChange(file)
        }
    }

    const triggerFileInput = () => {
        if (isEditing) fileInputRef.current?.click()
    }

    const actionIcon = previewUrl ? "hugeicons:pencil-edit-01" : "hugeicons:add-01"

    return (
        <div className={cn("relative group w-32 h-32 md:w-40 md:h-40", className)}>
            <div className="relative p-[3px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150 w-full h-full">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                <div
                    onClick={triggerFileInput}
                    className={cn(
                        "relative w-full h-full rounded-full border-4 border-white overflow-hidden bg-brand-neutral-4 transition-all z-10",
                        isEditing ? "cursor-pointer" : "border-gray-100",
                        !previewUrl && "flex items-center justify-center"
                    )}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Profile picture"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-brand-secondary-3">
                            <Icon icon="guidance:image" width="60" />
                        </div>
                    )}

                    {isEditing && (
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="sr-only">Upload Image</span>
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-brand-primary-6 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                >
                    <Icon icon={actionIcon} width="20" height="20" />
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={!isEditing}
            />
        </div>
    )
}