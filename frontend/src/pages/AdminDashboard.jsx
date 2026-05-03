import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get('/enquiry/all');
        setEnquiries(res.data.data);
      } catch (err) {
        console.error('Error fetching enquiries', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter(e => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
      || e.email.toLowerCase().includes(search.toLowerCase())
      || e.quotationNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id, status, notes) => {
    try {
      await api.patch(`/enquiry/${id}/status`, { status, adminNotes: notes });
      setEnquiries(prev =>
        prev.map(e => e._id === id ? { ...e, status, adminNotes: notes } : e)
      );
      setSelected(prev => ({ ...prev, status, adminNotes: notes }));
      alert('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await api.delete(`/enquiry/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
      setSelected(null);
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete');
    }
  };

  const STATUS_COLORS = {
    'new': '#cc3333',
    'read': '#ffaa00',
    'in-progress': '#4466ff',
    'completed': '#44c844',
    'rejected': 'rgba(255,255,255,0.2)'
  };

  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    inProgress: enquiries.filter(e => e.status === 'in-progress').length,
    completed: enquiries.filter(e => e.status === 'completed').length,
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.1em' }}>ALTA. ADMIN</h1>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={styles.statBox}>
              <div style={styles.statNum}>{stats.total}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div style={styles.statBox}>
              <div style={{...styles.statNum, color: STATUS_COLORS['new']}}>{stats.new}</div>
              <div style={styles.statLabel}>New</div>
            </div>
            <div style={styles.statBox}>
              <div style={{...styles.statNum, color: STATUS_COLORS['in-progress']}}>{stats.inProgress}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
            <div style={{...styles.statBox, borderRight: 'none'}}>
              <div style={{...styles.statNum, color: STATUS_COLORS['completed']}}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Logged in as: <strong style={{ color: '#fff' }}>{user?.name}</strong> — {user?.email}
          </span>
          <button 
            onClick={logout}
            style={{
              background: 'transparent',
              border: '1px solid #cc3333',
              color: '#cc3333',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div style={styles.panels}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <input 
              type="text" 
              placeholder="Search by name, email, or quote number..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 16px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {['all', 'new', 'read', 'in-progress', 'completed', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    background: statusFilter === status ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: statusFilter === status ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    color: statusFilter === status ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontSize: '11px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No enquiries found.</div>
            ) : (
              filtered.map(e => (
                <div 
                  key={e._id} 
                  style={{
                    ...styles.enquiryCard, 
                    ...(selected?._id === e._id ? styles.enquiryCardActive : {})
                  }}
                  onClick={() => setSelected(e)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ ...styles.statusDot, background: STATUS_COLORS[e.status] }} />
                      <span style={{ fontSize: '15px', fontWeight: 600, color: e.name === 'PENDING' ? '#ffaa00' : '#fff' }}>
                        {e.name === 'PENDING' ? 'PENDING' : e.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: e.email === 'PENDING' ? '#ffaa00' : 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                        {e.email === 'PENDING' ? 'Awaiting contact form' : e.email}
                      </div>
                      <div style={{ fontSize: '11px', color: '#cc3333', letterSpacing: '0.05em' }}>{e.quotationNumber}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                      ₹{e.quotationTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          {selected ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>{selected.quotationNumber}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ ...styles.statusDot, background: STATUS_COLORS[selected.status] }} />
                    <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: STATUS_COLORS[selected.status] }}>
                      {selected.status}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Date Submitted</div>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>
                    {new Date(selected.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                {/* Section A - Client Info */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>Client Info</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Name</div>
                    {selected.name === 'PENDING' ? (
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#ffaa00' }}>PENDING <span style={{ fontSize: '12px', opacity: 0.8 }}>(Awaiting contact form)</span></div>
                    ) : (
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>{selected.name}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Email</div>
                    {selected.email === 'PENDING' ? (
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#ffaa00' }}>PENDING</div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <a href={`mailto:${selected.email}`} style={{ fontSize: '16px', color: '#4466ff', textDecoration: 'none' }}>{selected.email}</a>
                        <a 
                          href={`mailto:${selected.email}?subject=Regarding your enquiry - Altaweb Studio (${selected.quotationNumber})`}
                          style={{
                            background: '#fff',
                            color: '#000',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          Reply via Email ↗
                        </a>
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Phone</div>
                    <div style={{ fontSize: '14px', color: '#fff' }}>{selected.phone || 'Not specified'}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Budget</div>
                    <div style={{ fontSize: '14px', color: '#fff' }}>{selected.budget || 'Not specified'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Project Details</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px' }}>{selected.projectDetails}</p>
                  </div>
                </div>

                {/* Section C - Status Manager */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>Admin Controls</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Update Status</div>
                    <select 
                      value={selected.status}
                      onChange={(e) => setSelected(prev => ({ ...prev, status: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        outline: 'none',
                        fontSize: '14px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {['new', 'read', 'in-progress', 'completed', 'rejected'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Admin Notes</div>
                    <textarea 
                      value={selected.adminNotes}
                      onChange={(e) => setSelected(prev => ({ ...prev, adminNotes: e.target.value }))}
                      placeholder="Internal notes about this client..."
                      style={{
                        flex: 1,
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '6px',
                        outline: 'none',
                        fontSize: '14px',
                        resize: 'none',
                        marginBottom: '16px',
                        minHeight: '100px'
                      }}
                    />
                    <button 
                      onClick={() => handleStatusChange(selected._id, selected.status, selected.adminNotes)}
                      style={{
                        background: '#fff',
                        border: 'none',
                        color: '#000',
                        padding: '12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                </div>
              </div>

              {/* Section B - Quotation Breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '32px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>Quotation Breakdown</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>SERVICE</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>PAGES</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>ADD-ONS</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.quotationItems.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#fff' }}>{item.serviceName}</td>
                        <td style={{ padding: '16px 0', fontSize: '14px', color: '#fff', textAlign: 'center' }}>
                          {item.pages ? item.pages : '-'}
                        </td>
                        <td style={{ padding: '16px 0', fontSize: '14px', color: '#fff' }}>
                          {item.addons && item.addons.length > 0 ? item.addons.join(', ') : '-'}
                        </td>
                        <td style={{ padding: '16px 0', fontSize: '14px', textAlign: 'right', color: '#fff' }}>
                          ₹{item.lineTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ width: '300px', marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#fff' }}>
                    <span>Subtotal:</span>
                    <span>₹{selected.quotationSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selected.quotationDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#44c844' }}>
                      <span>Coupon ({selected.quotationCoupon} -{(selected.quotationDiscount / selected.quotationSubtotal * 100).toFixed(0)}%):</span>
                      <span>-₹{selected.quotationDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#fff' }}>
                    <span>GST (18%):</span>
                    <span>₹{selected.quotationGST.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '24px', fontWeight: 700, color: '#cc3333' }}>
                    <span>TOTAL:</span>
                    <span>₹{selected.quotationTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Section D - Actions */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDelete(selected._id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #cc3333',
                    color: '#cc3333',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  DELETE ENQUIRY
                </button>
              </div>

            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
              Select an enquiry from the left to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#000',
    color: '#fff',
    fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    overflow: 'hidden'
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0
  },
  statBox: {
    padding: '0 24px',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center'
  },
  statNum: {
    fontSize: '28px',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginTop: '6px'
  },
  panels: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  leftPanel: {
    width: '35%',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  rightPanel: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px'
  },
  enquiryCard: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderLeft: '2px solid transparent'
  },
  enquiryCardActive: {
    background: 'rgba(180,30,30,0.08)',
    borderLeft: '2px solid #cc3333'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0
  }
};

export default AdminDashboard;
