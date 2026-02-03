export default function getActivityTypeText(activityType: ActivityType){
   return activityType === "check_in" ? "Check-in Successful" : activityType === "low_stock" ? "Ticket Low Stock Alert" :
    activityType === "new_sale" ? "New Sale" : activityType === "payout" ? "Payout" : null;
}