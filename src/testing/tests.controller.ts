import { Controller, Delete, HttpCode } from '@nestjs/common';

@Controller('testing')
export class TestController {
  constructor() {}

  @Delete('/all-data')
  @HttpCode(204)
  deleteAllData(): any {
    // return this.usersService.findOne("111111111111111111111111111111111111");
    return 'ok';
  }
 


}

