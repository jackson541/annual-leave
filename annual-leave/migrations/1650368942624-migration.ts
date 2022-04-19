import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1650368942624 implements MigrationInterface {
    name = 'migration1650368942624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "aaage" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "aaage"`);
    }

}
