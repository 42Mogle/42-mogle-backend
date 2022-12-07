import { Controller, Get, Post, Body, Redirect, Query, Res, UseGuards, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request, query } from 'express';
import { Token } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IntraIdDto } from './dto/intraId.dto';

@ApiTags('Auth')
@Controller('serverAuth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
    ) {}

  /**
   * GET /serverAuth/firstJoin?code=${code}
   */
  @Get('firstJoin')
  @ApiOperation({summary: 'get a user info from 42OAuth'})
	@ApiResponse({
		status: 200, 
		description: 'Success', 
    type: AuthDto
	})
  @ApiResponse({
		status: 401,
		description: '42 api에서 토큰 발급 실패'
	})
  @ApiResponse({
		status: 403,
		description: '이미 회원가입한 사용자'
	})
  @ApiResponse({
		status: 404,
		description: 'api.intra.42.fr/v2/me 요청 실패'
	})
  async firstJoin(@Query('code') code: string) {
    console.log("[ GET /serverAuth/firstJoin ] requested.");
    // todo: Rename to checkingAlreadySignedIn
    const intraIdDto: IntraIdDto = await this.authService.firstJoin(code);
    console.log(`intraId: [${intraIdDto.intraId}]`);
    return(intraIdDto);
  }

  /**
   * POST /serverAuth/secondJoin
   */
  @Post('secondJoin')
  @ApiOperation({summary: 'request a user sign-in'})
	@ApiResponse({
		status: 201, 
		description: 'Success',
    type: String
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden'
	})
  async secondJoin(@Body() authDto:AuthDto) {
    console.log("[ POST /serverAuth/secondJoin ] requested.");
    console.log(`authDto.intraId: [${authDto.intraId}]`);
    return(await this.authService.secondJoin(authDto));
  }

  /**
   * POST /serverAuth/login
   */
   @Post('login')
   @ApiOperation({summary: 'request user login'})
   @ApiResponse({
     status: 201, 
     description: 'Success'
   })
   @ApiResponse({
     status: 401,
     description: 'Unauthorized'
   })
   async login(@Res() response: Response, @Body() authDto: AuthDto) {
     console.log("[ POST /serverAuth/login ] requested.");
     console.log(`authDto.intraId: [${authDto.intraId}]`);
     const accessToken = await this.authService.login(authDto);
     response.send({ accessToken });
     return ;
   }
 
   /**
    * POST /serverAuth/logout
    */
   @Post('logout')
   @ApiOperation({summary: 'request user logout'})
   @ApiResponse({
     status: 201, 
     description: 'Success'
   })
   @ApiResponse({
     status: 403,
     description: 'Forbidden'
   })
   logout(@Res() response:Response) {
     console.log(`[ POST /serverAuth/logout ] requested.`);
     response.send({ message:'로그아웃' });
     return ;
   } 
}
