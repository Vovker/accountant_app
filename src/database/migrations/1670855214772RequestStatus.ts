import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestStatus1670855214772 implements MigrationInterface {
    name = 'RequestStatus1670855214772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ADD "status" character varying NOT NULL DEFAULT 'CREATED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "status"`);
    }

}
