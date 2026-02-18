import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { AttendanceRepository } from './attendance.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AttendanceService
  implements
    IRepository<
      Attendance,
      CreateAttendanceDto,
      GetAttendanceDto,
      UpdateAttendanceDto
    >
{
  constructor(private readonly attendanceRepo: AttendanceRepository) {}

  create(createDto: CreateAttendanceDto, req): Promise<Attendance[]> {
    return this.attendanceRepo.create(createDto, req);
  }

  getAll(query: GetAttendanceDto) {
    return this.attendanceRepo.getAll(query);
  }

  getById(id: string, query: GetAttendanceDto): Promise<Attendance> {
    return this.attendanceRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateAttendanceDto): Promise<Attendance> {
    return this.attendanceRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.attendanceRepo.delete(id);
  }
}
