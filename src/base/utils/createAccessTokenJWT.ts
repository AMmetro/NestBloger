// import { Injectable } from '@nestjs/common';
// // import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthJwtService {
//   constructor(private jwtService: JwtService) {} // private jwtService: JwtService // private usersService: UsersService,

//   async signIn(user: any, deviceId: string): Promise<{ access_token: string }> {
//     // const user = await this.usersService.findOne(username);
//     // if (user?.password !== pass) {
//     //   throw new UnauthorizedException();
//     // }
//     const payload = { userId: user.id, deviceId };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
// }
