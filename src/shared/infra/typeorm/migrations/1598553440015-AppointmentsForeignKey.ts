import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export default class AppointmentsForeignKey1598553440015 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey("appointments", new TableForeignKey({
            name: "AppointmentProvider",
            columnNames: ["provider_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("appointments", "AppointmentProvider");
    }

}
