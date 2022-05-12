import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1652358339506 implements MigrationInterface {
  name = 'CreateTables1652358339506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "amount" double precision NOT NULL,
                "description" character varying NOT NULL,
                "to_id" character varying NOT NULL,
                "from_id" character varying,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "transactions"
        `);
  }
}
