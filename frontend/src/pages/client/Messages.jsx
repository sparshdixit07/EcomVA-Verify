import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { messageService } from '../../services/message.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatRelative } from '../../utils/format.js';

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const res = await messageService.listConversations({});
      setConversations(res?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadMessages = async (id) => {
    if (!id) return;
    setLoadingMsgs(true);
    try {
      const res = await messageService.listMessages(id, { limit: 100 });
      setMessages(res?.items || []);
      try {
        await messageService.markRead(id);
      } catch {
        /* ignore */
      }
    } catch (err) {
      toast.error(err.message || 'Could not load messages');
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) loadMessages(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || !conversationId) return;
    setSending(true);
    try {
      const res = await messageService.send(conversationId, { content: draft.trim() });
      const msg = res?.message || res;
      setMessages((prev) => [...prev, msg]);
      setDraft('');
    } catch (err) {
      toast.error(err.message || 'Could not send');
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c._id === conversationId);

  return (
    <div>
      <PageHeader title="Messages" subtitle="Your conversations with VAs." />

      <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
        <Card className="lg:col-span-1">
          <CardBody className="p-0">
            {loadingConvs ? (
              <div className="py-10 flex justify-center"><Spinner /></div>
            ) : conversations.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon="✉️"
                  title="No conversations"
                  description="Start a conversation from a VA's profile."
                />
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {conversations.map((c) => {
                  const other = c.participants?.find((p) => p.role !== 'client') || c.va?.user || {};
                  const name = `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'VA';
                  const active = c._id === conversationId;
                  return (
                    <li key={c._id}>
                      <button
                        onClick={() => navigate(`/client/messages/${c._id}`)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-ink-50 ${
                          active ? 'bg-brand-50' : ''
                        }`}
                      >
                        <Avatar name={name} size="sm" src={other.avatarUrl} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-ink-900 truncate text-sm">{name}</div>
                          <div className="text-xs text-ink-500 truncate">
                            {c.lastMessage?.content || 'No messages yet'}
                          </div>
                        </div>
                        {c.unreadCount > 0 && (
                          <span className="text-xs bg-brand-600 text-white rounded-full px-2 py-0.5">
                            {c.unreadCount}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          {!conversationId ? (
            <CardBody>
              <EmptyState
                icon="💬"
                title="Select a conversation"
                description="Choose a conversation from the left, or start a new one from a VA's profile."
              />
            </CardBody>
          ) : (
            <div className="flex flex-col h-[600px]">
              <div className="px-5 py-3 border-b border-ink-100 flex items-center gap-3">
                <Avatar
                  name={
                    activeConv
                      ? `${activeConv.participants?.find((p) => p.role !== 'client')?.firstName || ''} ${
                          activeConv.participants?.find((p) => p.role !== 'client')?.lastName || ''
                        }`.trim()
                      : 'VA'
                  }
                />
                <div className="font-medium text-ink-900">
                  {activeConv?.participants?.find((p) => p.role !== 'client')?.firstName || 'Conversation'}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ink-50/40">
                {loadingMsgs ? (
                  <div className="flex justify-center"><Spinner /></div>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-ink-500 text-center mt-6">
                    No messages yet. Say hi.
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderRole === 'client' || m.sender?.role === 'client';
                    return (
                      <div
                        key={m._id}
                        className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            mine
                              ? 'bg-brand-600 text-white'
                              : 'bg-white border border-ink-100 text-ink-800'
                          }`}
                        >
                          <div className="whitespace-pre-line">{m.content}</div>
                          <div className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-ink-400'}`}>
                            {formatRelative(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              <div className="border-t border-ink-100 p-3">
                <div className="flex gap-2 items-end">
                  <Textarea
                    rows={2}
                    placeholder="Type a message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={send} loading={sending} disabled={!draft.trim()}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {error && <ErrorState message={error.message} onRetry={loadConversations} />}
    </div>
  );
}