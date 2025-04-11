import client from "../config/dbConfig";
import { CreateGoogleAuthDTO, CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { UserDTO, UserGoogleAuthDTO } from "../dto/users/user.dto";

class UserRepository {
    async findAll(): Promise<UserDTO[]> {
        const response = await client.query(
            "SELECT * FROM users"
        );

        return response.rows.length ? response.rows : null;
    }

    async findById(_id: UserDTO["id"]): Promise<UserDTO> {
        const response = await client.query(
            "SELECT id, email, username, role FROM users WHERE id = $1",
            [_id]
        );

        return response.rows.length ? response.rows[0] : null;
    }

    async findByEmail(email: UserDTO["email"]): Promise<UserDTO> {
        const response = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        return response.rows.length ? response.rows[0] : null;
    }

    async findByGoogleID(google_id: UserGoogleAuthDTO["google_id"]) {
        const response = await client.query(
            "SELECT id, email, display_name, role FROM users WHERE google_id = $1",
            [google_id]
        );

        return response.rows.length ? response.rows[0] : null;
    }

    async validateUser(email: UserDTO["email"]) {
        const response = await client.query(
            "UPDATE users SET valid = $1 WHERE email = $2",
            [
                true,
                email
            ]
        );

        return response.rowCount === 1;
    }

    async updatePassword(id: UserDTO["id"], newPassword: UserDTO["password"]) {
        const response = await client.query(
            "UPDATE users SET password = $1 WHERE id = $2;",
            [newPassword, id]
        );
        
        return response.rowCount === 1;
    }

    // Create traditional user
    async create(data: CreateNewUserDTO) {
        const response = await client.query(
            "INSERT INTO users (email, username, role, password) VALUES ($1, $2, $3, $4)",
            [
                data.email,
                data.username,
                data.role,
                data.password
            ]
        );
        
        const done = response?.rowCount === 1;

        return done;
    }

    // Create Google OAuth user
    async createAuth(data: CreateGoogleAuthDTO) {
        // Check user
        const response = await client.query(
            "INSERT INTO users (google_id, email, display_name, valid) VALUES ($1, $2, $3, $4)",
            [
                data.google_id,
                data.email,
                data.displayName,
                data.email_verified
            ]
        );

        const done = response?.rowCount === 1;

        return done;
    }

    async update(data: any, email: UserDTO["email"]) {

    }

    async delete(id: UserDTO["id"]) {

    }
}  

export default UserRepository;