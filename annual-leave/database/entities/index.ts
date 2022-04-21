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
    
    @Column()
    password: string
    
    @CreateDateColumn()
    joined_date: Date
}


@Entity()
export class EmailCodeValidation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: number
    
    @Column()
    code: number
    
    @Column({
        default: false
    })
    used: boolean

    @CreateDateColumn()
    created_at: Date
}
