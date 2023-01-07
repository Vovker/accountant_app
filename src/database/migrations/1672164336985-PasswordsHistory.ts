import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordsHistory1672164336985 implements MigrationInterface {
    name = 'PasswordsHistory1672164336985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "settings_id" uuid, CONSTRAINT "REL_6b780f1ae506a7d7bd0d45d675" UNIQUE ("settings_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "user_id_id" uuid, CONSTRAINT "PK_4244bafe3ae2988e7bb7af61268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_6b780f1ae506a7d7bd0d45d6751" FOREIGN KEY ("settings_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_137bc69f68562de40cba68093e2" FOREIGN KEY ("user_id_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_137bc69f68562de40cba68093e2"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_6b780f1ae506a7d7bd0d45d6751"`);
        await queryRunner.query(`DROP TABLE "user_passwords"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}
