import { Icon } from "@iconify/react"

interface IActionButton2Props {
    className?: string
    buttonText: string
    isLoading?: boolean
    isDisabled?: boolean
    action?: () => void
    buttonType?: "button" | "submit"
    icon?: string
    iconPosition?: "left" | "right"
}

export default function ActionButton2({
    className = "",
    buttonText,
    isLoading,
    isDisabled,
    action,
    buttonType = "button",
    icon,
    iconPosition = "left",
}: IActionButton2Props) {
    const isButtonDisabled = isLoading === true || isDisabled === true

    return (
        <button
            type={buttonType}
            disabled={isButtonDisabled}
            onClick={action}
            className={`
                text-xs
                md:text-sm
                bg-transparent
                border
                border-brand-secondary-6
                hover:bg-brand-neutral-4/60
                hover:shadow-sm
                hover:border-brand-secondary-7
                active:bg-brand-neutral-4
                disabled:bg-brand-neutral-2
                disabled:border-brand-neutral-4
                disabled:text-brand-neutral-6
                disabled:cursor-not-allowed
                text-brand-secondary-8
                py-3.5
                px-6
                rounded-[3em]
                h-12 md:h-14
                font-medium
                transition-all
                inline-flex
                items-center
                justify-center
                gap-2
                ${className}
            `}
        >
            {isLoading === true ? (
                <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-brand-secondary-8 border-t-transparent" />
                    Loading...
                </span>
            ) : (
                <>
                    {icon && iconPosition === "left" && (
                        <Icon icon={icon} width="18" height="18" className="size-5" />
                    )}

                    <span>{buttonText}</span>

                    {icon && iconPosition === "right" && (
                        <Icon icon={icon} width="18" height="18" className="size-5" />
                    )}
                </>
            )}
        </button>
    )
}