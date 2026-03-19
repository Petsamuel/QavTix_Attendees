import { getPaymentMethods } from "@/actions/payment-methods"
import PaymentMethodsPageCW from "@/components/page-content-wrappers/PaymentMethodsPageCW"

export default async function PaymentMethodsPage() {
    const result = await getPaymentMethods()

    return (
        <PaymentMethodsPageCW
            initialMethods={result.success ? (result.data ?? []) : []}
        />
    )
}