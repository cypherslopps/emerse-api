import client from "../config/dbConfig";
import { CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { UserDTO } from "../dto/users/user.dto";
import { UserPayload, UserResponse } from "../types/user.types";

const user = {
    id: 3,
    email: "josephibok@gmail.com",
    username: "username",
    password: "password"
};

class UserRepository {
    async findAll(): Promise<UserDTO[]> {
        return [user]
    }

    async findById(_id: UserDTO["id"]): Promise<UserDTO> {
        return user;
    }

    async findByEmail(email: UserDTO["email"]): Promise<UserDTO> {
        const response = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        return response.rows.length ? response.rows[0] : null;
    }

    async updatePassword(id: UserDTO["id"], newPassword: UserDTO["password"]) {
        const response = await client.query(
            "UPDATE users SET password = $1 WHERE id = $2;",
            [newPassword, id]
        );
        
        return response.rowCount === 1;
    }

    async create(data: CreateNewUserDTO) {
        try {
            const response = await client.query(
                "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
                [
                    data.email,
                    data.username,
                    data.password
                ]
            );
            
            const done = response?.rowCount === 1;

            return done;
        } catch (err) {
            throw new Error("An error occurred when registering user.");
        }
    }

    async update(data: any, email: UserDTO["email"]) {

    }

    async delete(id: UserDTO["id"]) {

    }
}  

export default UserRepository;