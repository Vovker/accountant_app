import { MigrationInterface, QueryRunner } from "typeorm";

export class calendar1670910565584 implements MigrationInterface {
    name = 'calendar1670910565584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar" DROP COLUMN "day"`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD "day" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar" DROP COLUMN "day"`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD "day" date NOT NULL`);
    }

}
