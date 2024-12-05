import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminService } from './admin.service';


@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: any) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('reports')
  async getAllReports(@Query() query: any) {
    return this.adminService.getAllReports(query);
  }

  @Get('reports/:id')
  async getReportDetails(@Param('id') id: number) {
    return this.adminService.getReportDetails(id);
  }

  @Put('reports/:id/resolve')
  async resolveReport(@Param('id') id: number, @Body() status: { status: string }) {
    return this.adminService.resolveReport(id, status);
  }

  @Put('reports/:id/assign')
  async assignReport(@Param('id') id: number, @Body() assignDto: { traffic_light_id: number }) {
    return this.adminService.assignReport(id, assignDto);
  }

  @Delete('reports/:id')
  async deleteReport(@Param('id') id: number) {
    return this.adminService.deleteReport(id);
  }
}
