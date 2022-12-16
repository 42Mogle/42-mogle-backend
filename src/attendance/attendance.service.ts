import { Inject, Injectable } from '@nestjs/common';
import { DbmanagerService } from 'src/dbmanager/dbmanager.service';
import { DayInfo } from '../dbmanager/entities/day_info.entity';
import { UserInfo } from '../dbmanager/entities/user_info.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { OperatorService } from '../operator/operator.service';
import { MonthInfo } from '../dbmanager/entities/month_info.entity';
import { ButtonStatus } from './button.status.enum';

@Injectable()
export class AttendanceService {
	@Inject(DbmanagerService) private readonly dbmanagerService: DbmanagerService;
	@Inject(OperatorService) private readonly operatorService: OperatorService;

	async getUserButtonStatus(userInfo: UserInfo): Promise<number> {
		// if (this.isAvailableTime() === false) {
		// 	return ButtonStatus.NotAvailableTime;
		// }
		// else if (await this.haveAttendedToday(userInfo)) {
		// 	return ButtonStatus.AlreadyCheckedAttendance;
		// }
		// else if (await !this.isSetToDayWord()) {
		// 	return (3)
		// }
		return ButtonStatus.AttendanceSuccess;
	}

	async AttendanceCertification(attendanceinfo: CreateAttendanceDto, userInfo: UserInfo) {
		const todayWord: string = await this.dbmanagerService.getTodayWord();
		const monthInto: MonthInfo = await this.dbmanagerService.getThisMonthInfo();
		// if (await this.haveAttendedToday(userInfo)) {
		// 	return ({
		// 		statusAttendance: 1,
		// 		errorMsg: "이미 출석 체크 했습니다."
		// 	});
		// }
		// if (attendanceinfo.todayWord !== todayWord) {
		// 	return ({
		// 		statusAttendance: 2,
		// 		errorMsg: "오늘의 단어가 다릅니다."
		// 	});
		// }
		let monthlyUser = await this.dbmanagerService.getThisMonthlyUser(userInfo);
		if (!monthlyUser)
			monthlyUser = await this.dbmanagerService.createMonthlyUser(userInfo);
		await this.dbmanagerService.attendanceRegistration(userInfo);
		await this.dbmanagerService.updateMonthlyUser(monthlyUser);
		await this.operatorService.updatePerfectStatus(monthlyUser, monthInto.currentAttendance);
		return ({
			statusAttendance: 0,
			errorMsg: "성공적으로 출석 체크를 완료했습니다."
		})
	}


	/***********************************
     * 			util function list     *
     ********************************* */
	
	isAvailableTime(): Boolean {
		const now = new Date();
		const start = new Date();
		const end = new Date();
		
		start.setHours(8, 30, 0);
		end.setHours(9, 0, 0);
		if (now < start || now > end)
			return (false);
		else
			return (true);
	}

	async haveAttendedToday(userInfo: UserInfo): Promise<boolean> {
		const todayInfo: DayInfo = await this.dbmanagerService.getTodayInfo();
		const todayAttendanceInfo = await this.dbmanagerService.getAttendanceUserInfo(userInfo, todayInfo);
		if (todayAttendanceInfo === null)
			return false;
		else
			return true;
	}

	async isTodayWordSet(): Promise<boolean> {
		const todayInfo: DayInfo = await this.dbmanagerService.getTodayInfo();
		if (todayInfo.todayWord === "뀨?")
			return (false);
		else
			return (true);
	}
}
