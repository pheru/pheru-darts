export function filterUserByIds(users, ids) {
    if (users.length === 0 || ids.length === 0) {
        return [];
    }
    let filteredUsers = [];
    for (let i = 0; i < ids.length; i++) {
        let user = getUserById(users, ids[i]);
        if (user === undefined) {
            console.error("No user with id '" + ids[i] + "' found");
        } else {
            filteredUsers.push(getUserById(users, ids[i]));
        }
    }
    return filteredUsers;
}

function getUserById(users, id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i];
        }
    }
}