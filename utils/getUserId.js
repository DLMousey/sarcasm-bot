export function getUserId(args) {
    let userId = null

    if (args.length === 1) {
        userId = args[0].replace(/[^0-9]/g, '')
    }

    if (userId.length !== 18) {
        throw new Error('No user id, or invalid user id provided')
    }

    return userId
}
