export const CONFIRMATION_ACTION_TYPES = {
    PUBLISH_EVENT: 'PUBLISH_EVENT',
    DELETE_COLLABORATOR: 'DELETE_COLLABORATOR',
    REACTIVATE_USER: 'REACTIVATE_USER',
    TRANSFER_TICKET: 'TRANSFER_TICKET',
    RESELL_TICKET: 'RESELL_TICKET',    
} as const;

export type ConfirmationActionType = keyof typeof CONFIRMATION_ACTION_TYPES;

export const getConfirmationAction = (
    type: ConfirmationActionType, 
    data?: any
) => {
    switch (type) {
        case 'PUBLISH_EVENT':
            return () => {
                console.log("Publishing...")
            }
        case 'DELETE_COLLABORATOR':
            return () => console.log(`Collaborator ${data?.id} removed`)
        
        case 'TRANSFER_TICKET':
            return () => {
                
            }

        case 'RESELL_TICKET':
            return () => {
                
            }

        case 'REACTIVATE_USER':
            return () => console.log("User reactivated")

        default:
            return () => {}
    }
}