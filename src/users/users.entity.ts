import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string;

    @Column()
    email: string;

    @Column()
    password: string

    
    @Column({nullable: true})
    passwordResetCode: string
    
    @Column({nullable: true})
    passwordResetCodeExpires: Date

    @Column({nullable: true})
    passwordChangedAt: Date

}