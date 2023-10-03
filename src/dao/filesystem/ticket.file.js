import { promises as fs } from 'fs';

class TicketManagerFile {
    constructor() {
        this.filename = './src/dao/filesystem/data/tickets.json';
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.filename);
        } catch (error) {
            await fs.writeFile(this.filename, '[]');
        }
    }

    async getTickets() {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets;
        } catch (error) {
            throw new Error('Error al leer el archivo de tickets:', error);
        }
    }

    async getTicketById(tid) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets.find(ticket => ticket.id === tid);
        } catch (error) {
            throw new Error('Error al leer el archivo de tickets:', error);
        }
    }

    async getTicketByCode(code) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets.find(ticket => ticket.code === code);
        } catch (error) {
            throw new Error('Error al leer el archivo de tickets:', error);
        }
    }

    async generateTicket(ticket) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);

            if (ticket.code && ticket.purchase_datetime && ticket.amount && ticket.purchaser) {
                tickets.push({ ...ticket, id: tickets.length + 1 });
                await fs.writeFile(this.filename, JSON.stringify(tickets));
            } else {
                throw new Error("Es necesario agregar más detalles para añadir este ticket");
            }
        } catch (error) {
            throw new Error('Error al agregar el ticket:', error);
        }
    }

    async deleteTicket(tid) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            const ticketToDelete = tickets.find(ticket => ticket.id === tid);

            if (ticketToDelete) {
                const updatedTickets = tickets.filter(ticket => ticket.id !== tid);
                await fs.writeFile(this.filename, JSON.stringify(updatedTickets));
            } else {
                throw new Error("No existe un ticket con el ID: " + tid);
            }
        } catch (error) {
            throw new Error('Error al eliminar el ticket:', error);
        }
    }
}

export default TicketManagerFile