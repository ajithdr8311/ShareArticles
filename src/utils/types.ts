
export type CreateUserParams = {
    username: string;
    email: string;
    password: string;
    bio: string;   
}

export type UpdateUserParams = {
    username: string;
    email: string;
    password: string;
    bio: string;   
}

export type CreateUserPostParams = {
    title: string;
    content: string;
}

export type UpdatePostParams = {
    title: string;
    content: string;
}