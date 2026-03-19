import { getPaymentMethods } from "@/actions/payment"
import PaymentMethodsPageCW from "@/components/page-content-wrappers/PaymentMethodPageCW"

export default async function PaymentMethodsPage() {
    const result = await getPaymentMethods()

    return (
        <PaymentMethodsPageCW
            initialMethods={result.success ? (result.data ?? []) : []}
        />
    )
}