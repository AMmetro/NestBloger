import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface DatabaseConfig {
  database: Partial<TypeOrmModuleOptions>;
}
 
export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres', 
    password: '1111',
    database: 'nestBlogger',
    autoLoadEntities: true,
    synchronize: true,
  },
});