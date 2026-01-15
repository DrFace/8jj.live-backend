import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { MatchesService } from '../matches/matches.service';

type JoinPayload = { matchId: number; userId: number; userName: string };
type ChatPayload = {
  matchId: number;
  userId: number;
  userName: string;
  message: string;
};

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // in-memory viewer counts (ok for MVP). For multi-server scale, move to Redis.
  private viewersByMatch = new Map<number, Set<string>>(); // matchId -> socketIds

  constructor(
    @InjectRepository(ChatMessage) private chatRepo: Repository<ChatMessage>,
    private analytics: AnalyticsService,
    private matches: MatchesService,
  ) {}

  private addViewer(matchId: number, socketId: string) {
    if (!this.viewersByMatch.has(matchId))
      this.viewersByMatch.set(matchId, new Set());
    this.viewersByMatch.get(matchId)!.add(socketId);
  }

  private removeViewer(matchId: number, socketId: string) {
    const set = this.viewersByMatch.get(matchId);
    if (!set) return;
    set.delete(socketId);
    if (set.size === 0) this.viewersByMatch.delete(matchId);
  }

  private currentViewers(matchId: number) {
    return this.viewersByMatch.get(matchId)?.size ?? 0;
  }

  @SubscribeMessage('join')
  async onJoin(
    @MessageBody() body: JoinPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    const match = await this.matches.get(body.matchId);
    if (!match) return { ok: false, error: 'Match not found' };

    socket.join(`match:${body.matchId}`);
    socket.data.matchId = body.matchId;
    socket.data.userId = body.userId;
    socket.data.userName = body.userName;

    this.addViewer(body.matchId, socket.id);

    const viewers = this.currentViewers(body.matchId);
    this.server
      .to(`match:${body.matchId}`)
      .emit('viewers', { matchId: body.matchId, viewers });

    await this.analytics.trackEvent({
      matchId: body.matchId,
      type: 'viewer_join',
      userId: body.userId,
      meta: { userName: body.userName, viewers },
    });

    return { ok: true, viewers };
  }

  @SubscribeMessage('leave')
  async onLeave(
    @MessageBody() body: { matchId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`match:${body.matchId}`);
    this.removeViewer(body.matchId, socket.id);

    const viewers = this.currentViewers(body.matchId);
    this.server
      .to(`match:${body.matchId}`)
      .emit('viewers', { matchId: body.matchId, viewers });

    await this.analytics.trackEvent({
      matchId: body.matchId,
      type: 'viewer_leave',
      userId: socket.data.userId ?? null,
      meta: { viewers },
    });

    return { ok: true };
  }

  @SubscribeMessage('chat')
  async onChat(
    @MessageBody() body: ChatPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    const match = await this.matches.get(body.matchId);
    if (!match) return { ok: false, error: 'Match not found' };
    if (!match.chatEnabled) return { ok: false, error: 'Chat disabled' };

    // basic slow-mode check could be added here later

    const msg = this.chatRepo.create({
      matchId: body.matchId,
      userId: body.userId,
      userName: body.userName,
      message: body.message,
    });
    const saved = await this.chatRepo.save(msg);

    this.server.to(`match:${body.matchId}`).emit('chat', {
      id: saved.id,
      matchId: saved.matchId,
      userId: saved.userId,
      userName: saved.userName,
      message: saved.message,
      createdAt: saved.createdAt,
    });

    await this.analytics.trackEvent({
      matchId: body.matchId,
      type: 'chat_message',
      userId: body.userId,
      meta: { len: body.message?.length ?? 0 },
    });

    return { ok: true };
  }

  async handleDisconnect(socket: Socket) {
    const matchId = socket.data.matchId as number | undefined;
    if (!matchId) return;

    this.removeViewer(matchId, socket.id);
    const viewers = this.currentViewers(matchId);

    this.server.to(`match:${matchId}`).emit('viewers', { matchId, viewers });

    await this.analytics.trackEvent({
      matchId,
      type: 'viewer_leave',
      userId: socket.data.userId ?? null,
      meta: { viewers, reason: 'disconnect' },
    });
  }
}
