import { DataSource } from 'typeorm';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DataSource, // add the datasource as a provider
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        try {
          // create the datasource instance, read the database configuration from the environment variables
          const dataSource = new DataSource({
            type: configService.get('DB_TYPE'),
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            // @ts-ignore
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            logging: configService.get('DB_LOGGING'),
            synchronize: configService.get('DB_SYNCHRONIZE'),
            entities: [`${__dirname}/../**/*.entity.{ts,js}`], // this will automatically load all entity files in the src folder
          });
          await dataSource.initialize(); // initialize the data source
          logger.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          logger.verbose(`Error connecting to database ${error}`);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
