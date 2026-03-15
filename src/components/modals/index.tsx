import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PasswordModal from "./PasswordConfirmationModal";
import CustomGlobalAlert from "../custom-utils/alerts/CustomGlobalAlert";

export default function PopUpsRenderer(){
    return (
        <>
            <CustomGlobalAlert />
            <SuccessModal />
            <ConfirmationModal />
            <PasswordModal />
        </>
    )
}