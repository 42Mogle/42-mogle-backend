import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DayInfo } from "./day_info.entity";
import { UserInfo } from "./user_info.entity";

@Entity()
//@Unique(['userInfo', 'dayInfo'])
export class Attendance {
	@PrimaryGeneratedColumn({ name: "id" })
	id: number;

	// link: https://stackoverflow.com/questions/62696628/how-can-i-create-columns-with-type-date-and-type-datetime-in-nestjs-with-typeorm
	@Column({ name: "timelog", type: 'timestamptz' })
	timelog: Date;

	@ManyToOne(() => UserInfo, (user: UserInfo) => user.attendances)
	@JoinColumn({ name: "user_info_id", referencedColumnName: 'id' })
	userInfo: UserInfo;

	@ManyToOne(() => DayInfo, (day_info: DayInfo) => day_info.attendances)
	@JoinColumn({ name: "day_info_id", referencedColumnName: 'id' })
	dayInfo: DayInfo;
}
