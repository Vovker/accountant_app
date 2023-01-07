import { MigrationInterface, QueryRunner } from "typeorm";

export class CalendarUpdate1672841414726 implements MigrationInterface {
    name = 'CalendarUpdate1672841414726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_6b780f1ae506a7d7bd0d45d6751"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "REL_6b780f1ae506a7d7bd0d45d675"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "settings_id"`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "vacation_days" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "sick_days" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "hired_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "user" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "UQ_0bf957e42204987f7f7c2ec053b" UNIQUE ("user")`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_0bf957e42204987f7f7c2ec053b" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_0bf957e42204987f7f7c2ec053b"`);
        await queryRunner.query(`ALTER TABLE "calendar" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "UQ_0bf957e42204987f7f7c2ec053b"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "user"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "hired_at"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "sick_days"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "vacation_days"`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "settings_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "REL_6b780f1ae506a7d7bd0d45d675" UNIQUE ("settings_id")`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_6b780f1ae506a7d7bd0d45d6751" FOREIGN KEY ("settings_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
