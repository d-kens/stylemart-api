import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRolesData1730991479983 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO tbl_roles (role_id, role_name, description)
            VALUES 
                ('da63f864-3e8b-4667-9fbf-ac6095cbb449', 'Admin', 'Administrator with full access'),
                ('e9205375-ace2-4360-bb80-3afaac126fee', 'User', 'Regular user with limited access');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM tbl_roles 
            WHERE role_id IN ('da63f864-3e8b-4667-9fbf-ac6095cbb449', 'e9205375-ace2-4360-bb80-3afaac126fee');
        `);
    }

}
