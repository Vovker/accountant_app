import { MigrationInterface, QueryRunner } from "typeorm";

export class chat1673016308897 implements MigrationInterface {
    name = 'chat1673016308897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "user_id" uuid, "request_id" uuid, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "chats_id" uuid`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_ec2bcd7c42da7a7d51773ae3bc1" FOREIGN KEY ("chats_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_6f64232d94659df0614c80ffd79" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_6f64232d94659df0614c80ffd79"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_ec2bcd7c42da7a7d51773ae3bc1"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "chats_id"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
