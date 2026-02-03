"use client"

import ActionButton1 from "./ActionBtn1"
import { useStepper } from "@/contexts/create-event/StepperProvider"
import { useEventCreation } from "@/contexts/create-event/CreateEventProvider"


export default function MultiStepFormButtonDuo(){

    const { currentStep } = useEventCreation()
    const { goToNextStep, goToPreviousStep } = useStepper()

    const getButtonText = () => {
        switch (currentStep) {
            case 1:
                return "Continue to Details";
            case 2:
                return "Continue to Tickets";
            case 3:
                return "Continue to Settings";
            case 4:
                return "Continue to Review";
            default:
                return "Continue";
        }
    }

    return (
        <div className="flex gap-4 pt-4 max-w-sm md:max-w-[unset]">
            <button
                type="button"
                onClick={() => goToPreviousStep()}
                className="max-w-30 min-w-30 md:w-38 h-12 md:h-14 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border border-brand-secondary-6 font-medium text-xs md:text-sm hover:bg-brand-neutral-3 hover:border-brand-secondary-7 active:bg-brand-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-neutral-4 focus:ring-offset-2 transition-all duration-150"
            >
                Back
            </button>

            <ActionButton1 
                buttonText={getButtonText()}
                action={() => goToNextStep()}
                className="flex-1"
                iconPosition="right"
                buttonType="submit"
                icon="gravity-ui:arrow-right"
            />
        </div>
    )
}