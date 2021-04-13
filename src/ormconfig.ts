import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./auth/entity/user.entity";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  url:
    "postgres://nzeraqhdnkkduc:62ec6f25305fd8d6ecf7f566f510cffd0c3bbb1bf5a9ac13735357828eb08c0b@ec2-52-21-252-142.compute-1.amazonaws.com:5432/db8u5nrqnnake9",
  host: "ec2-52-21-252-142.compute-1.amazonaws.com",
  port: 5432,
  username: "nzeraqhdnkkduc",
  password: "62ec6f25305fd8d6ecf7f566f510cffd0c3bbb1bf5a9ac13735357828eb08c0b",
  database: "db8u5nrqnnake9",
  entities: [User],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  logging: false,
  logger: "debug",
  migrations: [join(__dirname, "src/migration/**/*.ts")],
};

export = connectionOptions;
