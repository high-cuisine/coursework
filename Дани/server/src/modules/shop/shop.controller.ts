import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Request, Response } from 'express'; 

@Controller('shops')
export class ShopController {

    constructor(
        private readonly shopService: ShopService
    ) {}
    @Get('/')
    async getAll(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.shopService.getAll();
        
        res.status(200).json(response);
    }

    @Get('/')
    async getById(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { id } = req.query ;
        const response = await this.shopService.getById(Number(id));
        
        res.status(200).json(response);
    }

    @Post('/')
    async createShop(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { name, address, phone, email } = req.body ;
        const response = await this.shopService.createShop(String(name), String(address), String(phone), String(email));
        
        res.status(200).json(response);
    }
}
