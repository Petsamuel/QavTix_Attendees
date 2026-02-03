export const paymentStatusConfig = {
    pending: {
        label: "Pending",
        className: "border-brand-accent-2 bg-brand-accent-1 text-brand-accent-4",
    },
    confirmed: {
        label: "Confirmed",
        className: "border-[#35916033] bg-[#3591601A] text-[#359160]",
    },
    refunded: {
        label: "Refunded",
        className: "border-brand-primary-2 bg-brand-primary-1 text-brand-primary-4",
    },
    cancelled: {
        label: "Cancelled",
        className: "border-[#FF000033] bg-[#FF00001A] text-[#FF0000]",
    },
}

export const eventTimelineConfig = {
    today: {
        label: "Today",
        className: "border-[#C100C833] bg-[#C100C81A] text-[#C100C8]",
    },
    tomorrow: {
        label: "Tomorrow",
        className: "border-[#E2DB0033] bg-[#E2DB001A] text-[#E2DB00]",
    },
    upcoming: {
        label: "Upcoming",
        className: "border-[#94C80033] bg-[#94C8001A] text-[#94C800]",
    },
}



export const affiliateEarningsStatusConfig = {
    hold: { 
        label: "Hold", 
        className: "bg-text-brand-secondary-1 text-brand-secondary-4 border border-[#DBDDE1] rounded-sm" 
    },
    paid: { 
        label: "Paid", 
        className: "bg-[#94C8001A] text-[#94C800] border border-[#94C80033] rounded-sm" 
    },
    pending: { 
        label: "Pending", 
        className: "bg-brand-accent-1 text-brand-accent-4 border border-brand-accent-2 rounded-sm" 
    },
    failed: { 
        label: "Failed", 
        className: "bg-red-100 text-[#991B1B] border-red-200 rounded-sm" 
    },
}


export const withdrawalStatusConfig = {
    processing: { 
        label: "Processing", 
        className: "bg-[#FFF7ED] text-[#FB923C] border-none rounded-sm" 
    },
    completed: { 
        label: "Completed", 
        className: "bg-[#F0FDF4] text-[#84CC16] border-none rounded-sm" 
    },
    failed: { 
        label: "Failed", 
        className: "bg-[#FEE2E2] text-[#991B1B] border-none rounded-sm" 
    }
}