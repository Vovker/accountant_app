import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1672145510010 implements MigrationInterface {
    name = 'Init1672145510010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('CREATED', 'IN_PROGRESS', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "subject" character varying NOT NULL, "status" "public"."requests_status_enum" NOT NULL DEFAULT 'CREATED', "requester_id" uuid, "accountant_id" uuid, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'ACCOUNTANT', 'EMPLOYEE', 'MANAGER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'EMPLOYEE', "email" character varying NOT NULL, "password" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_translations_language_code_enum" AS ENUM('en_US', 'ru_RU')`);
        await queryRunner.query(`CREATE TABLE "post_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language_code" "public"."post_translations_language_code_enum" NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_977f23a9a89bf4a1a9e2e29c136" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "path" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."calendar_type_enum" AS ENUM('WORKING_DAY', 'HOLIDAY')`);
        await queryRunner.query(`CREATE TABLE "calendar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "day" TIMESTAMP NOT NULL, "type" "public"."calendar_type_enum" NOT NULL, CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_9bbf6b4bcb7c77f820c3457eb12" FOREIGN KEY ("accountant_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_translations" ADD CONSTRAINT "FK_11f143c8b50a9ff60340edca475" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_translations" DROP CONSTRAINT "FK_11f143c8b50a9ff60340edca475"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_9bbf6b4bcb7c77f820c3457eb12"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c"`);
        await queryRunner.query(`DROP TABLE "calendar"`);
        await queryRunner.query(`DROP TYPE "public"."calendar_type_enum"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TABLE "post_translations"`);
        await queryRunner.query(`DROP TYPE "public"."post_translations_language_code_enum"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
    }

}
