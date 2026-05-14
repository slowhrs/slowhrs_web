'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { sendChatMessage, deleteMessage } from '@/app/actions/chat';

type ChatMessage = {
  id: string;
  created_at: string;
  user_id: string;
  member_name: string;
  instagram: string | null;
  content: string;
  channel: string;
  is_pinned: boolean;
  pinned_at: string | null;
  is_deleted: boolean;
};

type Props = {
  userId: string;
  memberName: string;
  instagram: string | null;
  channel: string;
  isAdmin: boolean;
};

export default function ChatRoom({ userId, memberName, instagram, channel, isAdmin }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel', channel)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(100);

      if (data) setMessages(data);
    };
    loadMessages();
  }, [channel, supabase]);

  // Real-time subscription
  useEffect(() => {
    const sub = supabase
      .channel(`chat-${channel}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as ChatMessage;
            if (!newMsg.is_deleted) {
              setMessages((prev) => [...prev, newMsg]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as ChatMessage;
            if (updated.is_deleted) {
              setMessages((prev) => prev.filter((m) => m.id !== updated.id));
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [channel, supabase]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await sendChatMessage(userId, memberName, instagram, input, channel);
    setInput('');
    setSending(false);
  }, [input, sending, userId, memberName, instagram, channel]);

  const handleDelete = async (msgId: string, msgUserId: string) => {
    if (msgUserId === userId || isAdmin) {
      await deleteMessage(msgId, msgUserId === userId ? userId : undefined);
    }
  };

  const pinnedMessages = messages.filter((m) => m.is_pinned);
  const regularMessages = messages;

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  let lastDate = '';

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="border-b border-brand-red/30 bg-brand-red/5 px-4 py-3 flex flex-col gap-2 shrink-0">
          {pinnedMessages.map((m) => (
            <div key={m.id} className="flex items-start gap-2">
              <span className="text-[14px] shrink-0">📌</span>
              <div className="min-w-0">
                <span className="font-mono text-[9px] tracking-[0.15em] text-brand-red uppercase">
                  {m.member_name}
                </span>
                <p className="font-mono text-[11px] text-ink leading-snug mt-0.5 break-words">
                  {m.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
        {regularMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-[11px] text-ink-faint">no messages yet. say something.</p>
          </div>
        )}
        {regularMessages.map((m) => {
          const msgDate = formatDate(m.created_at);
          const showDateHeader = msgDate !== lastDate;
          lastDate = msgDate;
          const isOwn = m.user_id === userId;

          return (
            <div key={m.id}>
              {showDateHeader && (
                <div className="flex justify-center my-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase bg-bg px-3">
                    {msgDate}
                  </span>
                </div>
              )}
              <div className={`group flex items-start gap-3 py-1.5 hover:bg-white/[0.02] rounded px-2 -mx-2 ${isOwn ? '' : ''}`}>
                {/* Avatar initial */}
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[10px] uppercase mt-0.5"
                  style={{
                    background: isOwn
                      ? 'linear-gradient(135deg, var(--color-red), var(--color-rose))'
                      : 'rgba(255,255,255,0.06)',
                    color: isOwn ? '#fff' : 'var(--color-ink-dim)',
                  }}
                >
                  {m.member_name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-ink font-medium">
                      {m.member_name.split(' ')[0].toLowerCase()}
                    </span>
                    {m.instagram && (
                      <span className="font-mono text-[9px] text-ink-faint">
                        @{m.instagram.replace('@', '')}
                      </span>
                    )}
                    <span className="font-mono text-[8px] text-ink-faint ml-auto shrink-0">
                      {formatTime(m.created_at)}
                    </span>
                  </div>
                  <p className="font-mono text-[12px] text-ink-dim leading-relaxed mt-0.5 break-words">
                    {m.content}
                  </p>
                </div>
                {/* Delete button */}
                {(isOwn || isAdmin) && (
                  <button
                    onClick={() => handleDelete(m.id, m.user_id)}
                    className="opacity-0 group-hover:opacity-100 font-mono text-[9px] text-ink-faint hover:text-brand-red transition-all shrink-0 mt-1"
                    title="delete"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-brand-border px-4 py-3 shrink-0">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="say something..."
            maxLength={500}
            className="flex-1 bg-transparent border-b border-brand-border/50 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-brand-red focus:outline-none"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="font-mono text-[10px] tracking-[0.15em] text-ink-dim uppercase hover:text-brand-red transition-colors disabled:opacity-30 shrink-0"
          >
            {sending ? '...' : 'send'}
          </button>
        </div>
        <p className="font-mono text-[8px] text-ink-faint mt-1 text-right">
          {input.length}/500
        </p>
      </div>
    </div>
  );
}
