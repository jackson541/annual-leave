import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column({
        unique: true,  
    })
    email: string
    
    @Column({
        nullable: true,
    })
    password: string
    
    @CreateDateColumn()
    joined_date: Date
}


@Entity()
export class EmailCodeValidation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string
    
    @Column({
        length: 6,
    })
    code: string
    
    @Column({
        default: false
    })
    used: boolean

    @CreateDateColumn()
    created_at: Date
}
