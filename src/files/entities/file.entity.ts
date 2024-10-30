import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'files' })
export class Files {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    filename: string;

    @Column('text', {
        unique: true
    })
    path: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @CreateDateColumn()
    createdAt: Date;
}
