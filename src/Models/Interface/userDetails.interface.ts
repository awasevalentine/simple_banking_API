/* eslint-disable prettier/prettier */
export interface UserDetailsFromDb {
    user_id: number,
    email: string;
    firstname: string;
    middlename: string;
    lastname: string;
    created_date?: Date;
    password?: string;
}
