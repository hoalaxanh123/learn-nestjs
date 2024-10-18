import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentInput } from './student.create-input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ publicId: id });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} is cannot be found !`);
    }
    return student;
  }

  async getStudentsByIds(
    studentIds: string[],
    doubleCheck: boolean = false,
  ): Promise<Student[]> {
    // Get all student in the array of ids
    const result = [];
    for (const id of studentIds) {
      const student = await this.studentRepository.findOneBy({ publicId: id });
      if (student) {
        result.push(student);
      }
    }

    if (doubleCheck && (!result || result.length === 0)) {
      throw new NotFoundException(
        `No students with the given ids ${studentIds.join(',')} found!`,
      );
    }
    return result;
  }

  async getAllStudents(): Promise<Student[]> {
    return (await this.studentRepository.find()) || [];
  }

  async createStudent(createStudentInput: CreateStudentInput) {
    const { firstName, lastName } = createStudentInput;
    const student = this.studentRepository.create({
      publicId: uuid(),
      firstName,
      lastName,
    });
    return this.studentRepository.save(student);
  }
}
