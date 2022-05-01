import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1651414957563 implements MigrationInterface {
    name = 'migration1651414957563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "joined_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_code_validation" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "code" character varying(6) NOT NULL, "used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e8f373ef3ba54621536a2ece7bc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_code_validation"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
