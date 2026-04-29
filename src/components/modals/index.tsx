"use client"

import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PasswordModal from "./PasswordConfirmationModal";
import CustomGlobalAlert from "../custom-utils/alerts/CustomGlobalAlert";
import Snackbar from "../custom-utils/alerts/Snackbar";
import PopUpMessageAlertModal from "./PopUpMessageAlert";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closePopupAlertModal, triggerPopupAlert } from "@/lib/redux/slices/popupAlertSlice";
import { useEffect } from "react";
import { PROFILE_INCOMPLETE_ALERT } from "./resources/popup-message-alert-config";
import { usePathname } from "next/navigation";

export default function PopUpsRenderer() {

    const { isAuthenticated, user } = useAppSelector((state) => state.authUser)
    const dispatch = useAppDispatch()
    const pathName = usePathname()

    useEffect(() => {
        const isNotFound = pathName === "/_not-found" || pathName === "/not-found"
        const isAccountSettings = pathName.includes("account-settings")
        const shouldSuppress = isNotFound || isAccountSettings

        if (!user?.is_completed && isAuthenticated && !shouldSuppress) {
            dispatch(triggerPopupAlert(PROFILE_INCOMPLETE_ALERT))
        }

        if (shouldSuppress) {
            dispatch(closePopupAlertModal())
        }
    }, [user?.id, user?.is_completed, isAuthenticated, pathName])

    return (
        <>
            <CustomGlobalAlert />
            <Snackbar />
            <SuccessModal />
            <ConfirmationModal />
            <PasswordModal />
            <PopUpMessageAlertModal />
        </>
    )
}