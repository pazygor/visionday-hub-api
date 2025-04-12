import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateContactDto) {
        return this.prisma.contact.create({
          data: {
            email: data.email,
            phone: data.phone,
            serverId: data.server_id,
            alertId: data.alert_id,
          },
        });
      }

    async findAll() {
        return this.prisma.contact.findMany();
    }

    async findOne(id: number) {
        return this.prisma.contact.findUnique({ where: { id } });
    }

    async update(id: number, data: UpdateContactDto) {
        return this.prisma.contact.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.contact.delete({ where: { id } });
    }
}