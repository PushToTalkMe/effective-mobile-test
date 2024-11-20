import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateUsers1732043385676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
            "id" SERIAL PRIMARY KEY,
            "firstName" VARCHAR(255) NOT NULL,
            "lastName" VARCHAR(255) NOT NULL,
            "age" INT NOT NULL,
            "gender" VARCHAR(10) NOT NULL,
            "hasProblems" BOOLEAN NOT NULL
          );
          `);

    const batchSize = 10000;
    const totalUsers = 1000000;

    for (let i = 0; i < totalUsers / batchSize; i++) {
      const users = [];

      for (let j = 0; j < batchSize; j++) {
        const firstName = faker.person.firstName().replace(/'/g, "''");
        const lastName = faker.person.lastName().replace(/'/g, "''");
        const age = faker.number.int({ min: 1, max: 150 });
        const gender = faker.helpers.arrayElement(['Male', 'Female']);
        const hasProblems = faker.datatype.boolean();

        users.push(
          `('${firstName}', '${lastName}', ${age}, '${gender}', ${hasProblems})`,
        );
      }

      await queryRunner.query(
        `INSERT INTO "users" ("firstName", "lastName", "age", "gender", "hasProblems")
            VALUES ${users.join(',')};`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
