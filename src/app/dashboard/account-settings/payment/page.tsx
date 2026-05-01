import { getPaymentMethods } from "@/actions/payment/client"
import PaymentMethodsPageCW from "@/components/page-content-wrappers/PaymentMethodPageCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"
import { cookies } from "next/headers"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.PAYMENT;


export default async function PaymentMethodsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getPaymentMethods()

    return (
        <PaymentMethodsPageCW
            initialMethods={result.success ? (result.data ?? []) : []}
        />
    )
}