import { MigrationInterface, QueryRunner } from "typeorm";

export class calendar1670909049791 implements MigrationInterface {
    name = 'calendar1670909049791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar" ADD "day" date NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."calendar_type_enum" AS ENUM('WORKING_DAY', 'HOLIDAY')`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD "type" "public"."calendar_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."calendar_type_enum"`);
        await queryRunner.query(`ALTER TABLE "calendar" DROP COLUMN "day"`);
    }

}
