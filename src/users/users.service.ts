import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

import { User } from 'src/graphql/models/User.model';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class UsersService {
  // @InjectRepository(User): Injects the TypeORM repository for the User entity, enabling you to interact with the database.

  constructor(
    // usersRepository: A private property that holds the injected repository, which is used to perform database operations related to the User entity.

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //This will return a Promise and hence will be an Asynchronous function.
  getUsers() {
    return this.usersRepository.find();
  }

  //   Create User
  async createUser(userData: CreateUserDto) {
    const { name, email, password, profilePhoto } = userData;

    const hashedPassword = await argon.hash(password);

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
    });

    return this.usersRepository.save(newUser);
  }

  // Find User by id
  getUserById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
  /*
  # Alternative
  getUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
  */
}
