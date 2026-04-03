"use client"

import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PasswordModal from "./PasswordConfirmationModal";
import CustomGlobalAlert from "../custom-utils/alerts/CustomGlobalAlert";
import PopUpMessageAlertModal from "./PopUpMessageAlert";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { triggerPopupAlert } from "@/lib/redux/slices/popupAlertSlice";
import { useEffect } from "react";
import { PROFILE_INCOMPLETE_ALERT } from "./resources/popup-message-alert-config";
import { usePathname } from "next/navigation";

export default function PopUpsRenderer(){

    const { isAuthenticated, user } = useAppSelector((state) => state.authUser)
    const dispatch = useAppDispatch()
    const pathName = usePathname()
    
    useEffect(() => {
        if (!user?.is_completed && isAuthenticated && !pathName.includes("/profile")) {
            dispatch(triggerPopupAlert(PROFILE_INCOMPLETE_ALERT))
        }
    },[user?.id, user?.is_completed, isAuthenticated, pathName])

    return (
        <>
            <CustomGlobalAlert />
            <SuccessModal />
            <ConfirmationModal />
            <PasswordModal />
            <PopUpMessageAlertModal />
        </>
    )
}