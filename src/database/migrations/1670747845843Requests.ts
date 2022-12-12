import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Requests1670747845843 implements MigrationInterface {
  name = 'Requests1670747845843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(
      `CREATE TABLE "requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                 "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                   "title" character varying NOT NULL,
                    "subject" character varying NOT NULL,
                     "requester_id" uuid,
                      "accountant_id" uuid,
                       CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "requests" ADD CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c"
                FOREIGN KEY ("requester_id") REFERENCES "users"("id")
                 ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "requests" ADD CONSTRAINT "FK_9bbf6b4bcb7c77f820c3457eb12"
                FOREIGN KEY ("accountant_id") REFERENCES "users"("id") 
                ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requests" DROP CONSTRAINT "FK_9bbf6b4bcb7c77f820c3457eb12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "requests" DROP CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c"`,
    );
    await queryRunner.query(`DROP TABLE "requests"`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id")
                REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
