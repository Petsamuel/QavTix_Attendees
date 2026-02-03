import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PasswordModal from "./PasswordConfirmationModal";

export default function PopUpsRenderer(){
    return (
        <>
            <SuccessModal />
            <ConfirmationModal />
            <PasswordModal />
        </>
    )
}