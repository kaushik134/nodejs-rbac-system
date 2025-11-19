const auth = {
    emailTaken: "Email is already registered.",
    registerSuccess: "Registration successful.",
    notFound: "User not found.",
    invalidCredentials: "Invalid email or password.",
    loginSuccess: "Login successful.",
    invalidToken: "Invalid or expired token.",
    accessDenied: "Access denied. No token provided.",
}

const roleMsg = {
    createRole: "Role created successfully.",
    notFound: "Role not found",
    fetchRole: "Roles fetched successfully.",
    fetchDetails: "Role details fetched successfully",
    updateRole: "Role updated successfully",
    roleDeleted: "Role deleted successfully",
}

const userMsg = {
    emailTaken: "Email is already registered.",
    userCreated: "User created successfully.",
    reActivate: "User reactivated successfully.",
    fetchUsers: "Users fetched successfully.",
    fetchUserDetails: "User details fetched successfully.",
    notFound: "User not found.",
    userUpdated: "User updated successfully.",
    userDeleted: "User deleted successfully.",
    bulkSameSuccess: "Users updated successfully with same data.",
    bulkDifferentSuccess: "Users updated successfully with different data."
};

module.exports = {
    auth,
    roleMsg,
    userMsg,
}