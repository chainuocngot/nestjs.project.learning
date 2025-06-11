import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send-message')
  handleEvent(@MessageBody() data: string): string {
    this.server.emit('receive-message', {
      content: `Hello ${data}`,
    });
    return data;
  }
}
