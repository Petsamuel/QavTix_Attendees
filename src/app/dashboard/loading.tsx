import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader";
import TableLoader from "@/components/loaders/TableLoader";

export default function Loading() {
    return (
        <div>
            <MetricsContainerLoader />
            <TableLoader />
        </div>
    )
}