import AuthUserDetailsWithActiveStatus from "./AuthUserDetailsWithActiveStatus";
import { DashboardHeaderSectionPathName } from "./DashboardHeaderSectionPathName";



export default function DesktopHeaderSection(){
    return (
        <header className="hidden lg:flex bg-white py-10 items-center px-6 absolute mx-auto h-24.5 border-b-2 border-b-gray-200/70 top-0 left-0 w-full justify-between">
            <DashboardHeaderSectionPathName />

            <AuthUserDetailsWithActiveStatus />
        </header>
    )
}