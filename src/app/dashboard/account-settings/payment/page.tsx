import { getPaymentMethods } from "@/actions/payment"
import PaymentMethodsPageCW from "@/components/page-content-wrappers/PaymentMethodPageCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.PAYMENT;


export default async function PaymentMethodsPage() {
    const result = await getPaymentMethods()

    return (
        <PaymentMethodsPageCW
            initialMethods={result.success ? (result.data ?? []) : []}
        />
    )
}