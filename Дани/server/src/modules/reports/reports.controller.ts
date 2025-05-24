import { Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Request, Response } from 'express'; 
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {

    constructor(
        private readonly reportService: ReportsService
    ) {}
    
    @Get('/')
    async getAllReports(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.reportService.getTAllReports();

        res.status(200).json(response);
    }

    @Get('/by-id/:id')
    async getById(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { id } =req.params;
        `SELECT * FROM tests WHERE id = ${id}`;

        const response = await this.reportService.getReportById(Number(id));

        res.status(200).json(response);
    }

    @Post('/create')
    async createReport(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { store_id,  month, total_revenue } = req.body;

        const response = await this.reportService.createReport(Number(store_id),  Number(month), Number(total_revenue));

        res.status(200).json(response);
    }

    @Delete('/delete/:id')
    async deleteReport(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { id } = req.params;

        const response = await this.reportService.deleteReport(Number(id));

        res.status(200).json(response);

    }

    @Patch('/update/:id')
    async updateReport(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { id } = req.params;
        const { store_id, month, total_revenue } = req.body;

        const response = await this.reportService.updateReport(Number(id), Number(store_id), Number(month), Number(total_revenue));

        res.status(200).json(response);
    }

    @Get('inventory')
    async getInventoryReport() {
        return this.reportService.getInventoryReport();
    }
}
