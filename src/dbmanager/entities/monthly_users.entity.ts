import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MonthInfo } from "./month_info.entity";
import { UserInfo } from "./user_info.entity";

@Entity()
@Unique(['monthInfo', 'userInfo'])
export class MonthlyUsers {
	@PrimaryGeneratedColumn({ name: "id" })
	id: number;

	@Column({ name: "attendance_count" })
	attendanceCount: number;

	@Column({ name: "is_perfect" })
	isPerfect: boolean;

	@Column({ name: "total_perfect_count" })
	totalPerfectCount: number;

	@ManyToOne(
		() => MonthInfo, 
		(monthInfo) => monthInfo.monthlyUsers
	)
	@JoinColumn({ 
		name: "month_info_id", 
		referencedColumnName: "id" 
	})
	monthInfo: MonthInfo;

	@ManyToOne(
		() => UserInfo,
		(user_info) => user_info.monthlyUsers
	)
	@JoinColumn({ 
		name: "user_info_id", 
		referencedColumnName: "id" 
	})
	userInfo: UserInfo;
}
