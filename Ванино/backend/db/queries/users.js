const queries = {
    createUser: `
        INSERT INTO users (username, password_hash, email, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, username, email, role, created_at
    `,
    
    getUserByUsername: `
        SELECT user_id, username, password_hash, email, role, created_at
        FROM users
        WHERE username = $1
    `,
    
    getUserByEmail: `
        SELECT user_id, username, password_hash, email, role, created_at
        FROM users
        WHERE email = $1
    `,
    
    updateUser: `
        UPDATE users
        SET username = $1,
            email = $2,
            role = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4
        RETURNING user_id, username, email, role, updated_at
    `,
    
    deleteUser: `
        DELETE FROM users
        WHERE user_id = $1
        RETURNING user_id
    `,
    
    getAllUsers: `
        SELECT user_id, username, email, role, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
    `
};

module.exports = queries; 