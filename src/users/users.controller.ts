import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("one")
  grtAllUsers(): any {
    return this.usersService.findOne("111111111111111111111111111111111111");
  }


  @Get("all")
  getOneUser(): any {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() dto): any {
    return this.usersService.create(dto);
  }



}




// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { CatsService } from './users.service';

// @Controller('users')
// export class CatsController {
//   constructor(private readonly catsService: CatsService) {}

//   @Get("one")
//   grtAllUsers(): any {
//     return this.catsService.findAll();
//   }

// }

