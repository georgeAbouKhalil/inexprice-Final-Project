class ClientError {

    public status: number; // 4xx  400, 401, 403, 404...
    public message: string;

    public constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }

}

export default ClientError;
