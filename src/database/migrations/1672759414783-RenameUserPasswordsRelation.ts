import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserPasswordsRelation1672759414783 implements MigrationInterface {
    name = 'RenameUserPasswordsRelation1672759414783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_69bf155ad044d776976470eb032"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" RENAME COLUMN "user_id" TO "user"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_6bd3a59429f332fcc30eb3abc5d" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_6bd3a59429f332fcc30eb3abc5d"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" RENAME COLUMN "user" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_69bf155ad044d776976470eb032" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
