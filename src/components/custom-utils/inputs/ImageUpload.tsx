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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update preview if initialImage changes from props
    useEffect(() => {
        if (initialImage) setPreviewUrl(initialImage);
    }, [initialImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a local preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            
            // Pass the file back to the parent form (React Hook Form or state)
            if (onImageChange) onImageChange(file)
        }
    }

    const triggerFileInput = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    }

    // Determine which icon to show on the floating button
    const actionIcon = previewUrl ? "hugeicons:pencil-edit-01" : "hugeicons:add-01";

    return (
        <div className={cn("relative w-32 h-32 md:w-40 md:h-40 group", className)}>
            {/* Main Image Container */}
            <div 
                onClick={triggerFileInput}
                className={cn(
                    "relative w-full h-full rounded-full border-2 overflow-hidden bg-brand-neutral-4 transition-all",
                    isEditing ? "cursor-pointer border-dashed border-brand-primary-6/40 hover:border-brand-primary-6" : "border-gray-100",
                    !previewUrl && "flex items-center justify-center"
                )}
            >
                {previewUrl ? (
                    <Image 
                        src={previewUrl} 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-brand-secondary-3">
                        <Icon icon="guidance:image" width="60" />
                    </div>
                )}

                {/* Overlay when editing */}
                {isEditing && (
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                         <span className="sr-only">Upload Image</span>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {isEditing && (
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-brand-primary-6 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                >
                    <Icon icon={actionIcon} width="20" height="20" />
                </button>
            )}

            {/* Hidden Input */}
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={!isEditing}
            />
        </div>
    )
}