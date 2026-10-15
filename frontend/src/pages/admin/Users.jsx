import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { adminService } from '../../services/admin.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, titleCase } from '../../utils/format.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Users() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 400);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, total, totalPages, setPage, setTotal } = usePagination(1, 15);
  const [suspend, setSuspend] = useState({ open: false, id: null, reason: '', loading: false });
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listUsers({
        q: debounced || undefined,
        role: role || undefined,
        status: status || undefined,
        page,
        limit
      });
      setItems(res?.items || []);
      setTotal(res?.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, role, status, page]);

  const onActivate = async (id) => {
    setActionLoading(true);
    try {
      await adminService.activateUser(id);
      toast.success('User activated');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const onSuspend = async () => {
    setSuspend((s) => ({ ...s, loading: true }));
    try {
      await adminService.suspendUser(suspend.id, suspend.reason);
      toast.success('User suspended');
      setSuspend({ open: false, id: null, reason: '', loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
      setSuspend((s) => ({ ...s, loading: false }));
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${row.firstName || ''} ${row.lastName || ''}`}
            src={row.avatarUrl}
            size="sm"
          />
          <div className="min-w-0">
            <div className="font-medium text-ink-900 truncate">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-xs text-ink-500 truncate">{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', render: (row) => <Badge tone="brand">{titleCase(row.role)}</Badge> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone={statusTone(row.status)}>{titleCase(row.status)}</Badge>
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (row) => <span className="text-sm text-ink-600">{formatDate(row.createdAt)}</span>
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {row.status !== 'active' && (
            <Button size="sm" variant="success" onClick={() => onActivate(row._id)} disabled={actionLoading}>
              Activate
            </Button>
          )}
          {row.status !== 'suspended' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setSuspend({ open: true, id: row._id, reason: '', loading: false })}
            >
              Suspend
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage all platform accounts." />

      <Card className="mb-6">
        <CardBody>
          <div className="grid sm:grid-cols-4 gap-3">
            <Input
              className="sm:col-span-2"
              label="Search"
              placeholder="Name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All roles</option>
              <option value="client">Client</option>
              <option value="va">VA</option>
              <option value="admin">Admin</option>
            </Select>
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
          ) : error ? (
            <ErrorState message={error.message} onRetry={load} />
          ) : items.length === 0 ? (
            <EmptyState icon="👥" title="No users found" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        open={suspend.open}
        onClose={() => setSuspend({ open: false, id: null, reason: '', loading: false })}
        title="Suspend user"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSuspend({ open: false, id: null, reason: '', loading: false })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={onSuspend} loading={suspend.loading}>
              Suspend
            </Button>
          </>
        }
      >
        <Textarea
          label="Reason"
          rows={4}
          value={suspend.reason}
          onChange={(e) => setSuspend((s) => ({ ...s, reason: e.target.value }))}
          hint="This will be recorded in the audit log."
        />
      </Modal>
    </div>
  );
}