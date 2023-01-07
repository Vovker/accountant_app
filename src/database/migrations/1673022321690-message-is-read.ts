import { MigrationInterface, QueryRunner } from "typeorm";

export class messageIsRead1673022321690 implements MigrationInterface {
    name = 'messageIsRead1673022321690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ADD "is_read" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "is_read"`);
    }

}
