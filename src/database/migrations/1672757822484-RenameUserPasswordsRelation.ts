import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserPasswordsRelation1672757822484 implements MigrationInterface {
    name = 'RenameUserPasswordsRelation1672757822484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_137bc69f68562de40cba68093e2"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" RENAME COLUMN "user_id_id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_69bf155ad044d776976470eb032" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_69bf155ad044d776976470eb032"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" RENAME COLUMN "user_id" TO "user_id_id"`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_137bc69f68562de40cba68093e2" FOREIGN KEY ("user_id_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
