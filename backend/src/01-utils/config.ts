abstract class Config {
    public port: number = 3001;
    public loginExpiresIn: string;
}

class DevelopmentConfig extends Config {
    public mongoConnectionString = "mongodb://localhost:27017/InexPrice";
    public constructor() {
        super();
        this.loginExpiresIn = "30d"; // 30 days
    }
}

const config = new DevelopmentConfig();

export default config;    
