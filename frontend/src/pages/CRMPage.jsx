import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ClientReportTemplate from '../components/ClientReportTemplate';
import { generateClientPDF } from '../utils/generateClientPDF';

const CRMPage = () => {
  const navigate = useNavigate();
  
  const [clients, setClients] = useState([]);
  const rightPanelRef = useRef(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedClient, setEditedClient] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [openSections, setOpenSections] = useState({
    core: true, project: true, communication: false,
    workflow: false, assets: false, tasks: true, financial: false
  });
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const STAGES = ['All', 'Lead', 'Discovery', 'Proposal', 'Onboarding', 'In Progress', 'Review', 'Delivered', 'Maintenance', 'Closed'];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      setClients(res.data.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchStage = stageFilter === 'All' || c.projectStage === stageFilter;
    const searchLower = search.toLowerCase();
    const matchSearch = (c.clientName || '').toLowerCase().includes(searchLower) || 
                        (c.businessName || '').toLowerCase().includes(searchLower);
    return matchStage && matchSearch;
  });

  const handleFieldChange = (field, value) => {
    setEditedClient(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate balance pending
      if (field === 'totalProjectValue' || field === 'advanceReceived') {
        const total = field === 'totalProjectValue' ? Number(value) : Number(updated.totalProjectValue || 0);
        const advance = field === 'advanceReceived' ? Number(value) : Number(updated.advanceReceived || 0);
        updated.balancePending = total - advance;
      }
      return updated;
    });
    setIsDirty(true);
  };

  const handleTaskChange = (index, field, value) => {
    setEditedClient(prev => {
      const newTasks = [...prev.todoList];
      newTasks[index] = { ...newTasks[index], [field]: value };
      return { ...prev, todoList: newTasks };
    });
    setIsDirty(true);
  };

  const addTask = () => {
    setEditedClient(prev => ({
      ...prev,
      todoList: [...(prev.todoList || []), { task: 'New Task', assignedTo: 'Aenish', deadline: null, status: 'Pending' }]
    }));
    setIsDirty(true);
  };

  const deleteTask = (index) => {
    setEditedClient(prev => {
      const newTasks = [...prev.todoList];
      newTasks.splice(index, 1);
      return { ...prev, todoList: newTasks };
    });
    setIsDirty(true);
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    setEditedClient({ ...client });
    setIsDirty(false);
    setCreating(false);
    setErrorMsg('');
    setSuccessMsg('');
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startCreate = () => {
    setCreating(true);
    setSelectedClient(null);
    setEditedClient({
      clientName: '', businessName: '', email: '', phone: '', city: '', country: '',
      businessType: '', websiteLink: '', socialLinks: '', preferredContact: '',
      timezone: '', leadSource: '', projectType: '', projectStage: 'Lead',
      startDate: '', targetDeliveryDate: '', priorityLevel: 'Medium', budgetRange: '',
      packageChosen: '', addOnsSelected: '', lastCallDate: '', lastMessageDate: '',
      lastEmailDate: '', whoSpokeLast: '', whatWasDiscussed: '', didTheyReply: false,
      nextFollowUpDate: '', followUpStatus: 'Pending',
      
      discoveryCallDone: false, proposalSent: false, proposalApproved: false,
      onboardingCallDone: false, triggerFormCompleted: false, contractSigned: false,
      invoicePaid: false, groupChatCreated: false, firstDeliverySent: false,
      feedbackReceived: false, revisionsPending: false, finalDeliveryDone: false,
      maintenanceOngoing: false,
      
      logoReceived: false, brandColorsReceived: false, fontsReceived: false,
      contentReceived: false, imagesReceived: false, videosReceived: false,
      hostingAccessReceived: false, domainAccessReceived: false, githubAccessReceived: false,
      figmaAccessReceived: false, adminPanelAccessReceived: false,
      
      todoList: [], internalNotes: '', clientNotes: '', blockers: '', riskLevel: 'Low', waitingOn: 'Neither',
      
      totalProjectValue: 0, advanceReceived: 0, balancePending: 0, invoiceStatus: 'Not Sent',
      paymentDueDate: '', paymentMethod: '', revisionPolicyAccepted: false
    });
    setIsDirty(true);
    setErrorMsg('');
    setSuccessMsg('');
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    try {
      setErrorMsg('');
      
      const payload = { ...editedClient };
      const dateFields = ['startDate', 'targetDeliveryDate', 'lastCallDate', 'lastMessageDate', 'lastEmailDate', 'nextFollowUpDate', 'paymentDueDate'];
      dateFields.forEach(field => {
        if (payload[field] === '') {
          payload[field] = null;
        }
      });
      
      if (payload.todoList) {
        payload.todoList = payload.todoList.map(task => ({
          ...task,
          deadline: task.deadline === '' ? null : task.deadline
        }));
      }

      if (creating) {
        if (!payload.clientName) {
          setErrorMsg('Client Name is required');
          return;
        }
        const res = await api.post('/clients', payload);
        setClients(prev => [res.data.data, ...prev]);
        selectClient(res.data.data);
        showSuccess('Created ✓');
      } else {
        const res = await api.put(`/clients/${payload._id}`, payload);
        setClients(prev => prev.map(c => c._id === editedClient._id ? res.data.data : c));
        selectClient(res.data.data);
        showSuccess('Saved ✓');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMsg(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    if (!window.confirm('Are you sure you want to delete this client permanently?')) return;
    
    try {
      await api.delete(`/clients/${selectedClient._id}`);
      setClients(prev => prev.filter(c => c._id !== selectedClient._id));
      setSelectedClient(null);
      setEditedClient(null);
    } catch (err) {
      console.error('Delete failed:', err);
      setErrorMsg('Delete failed');
    }
  };

  const handleExportPDF = async () => {
    if (!selectedClient) return;
    setGeneratingPDF(true);
    // Small delay to ensure hidden element renders fully
    await new Promise(resolve => setTimeout(resolve, 300));
    await generateClientPDF('client-report-template', selectedClient.clientName);
    setGeneratingPDF(false);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const PRIORITY_COLORS = {
    'Urgent': '#cc3333',
    'High': '#ffaa00',
    'Medium': '#4466ff',
    'Low': 'rgba(255,255,255,0.2)',
    '': 'transparent'
  };

  const STAGE_COLORS = {
    'Lead': '#ffffff', 'Discovery': '#ffaa00', 'Proposal': '#4466ff', 'Onboarding': '#8844ff',
    'In Progress': '#44c844', 'Review': '#ff44aa', 'Delivered': '#44ccaa', 'Maintenance': '#aaaaaa', 'Closed': '#333333'
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => !['Delivered', 'Closed'].includes(c.projectStage)).length,
    delivered: clients.filter(c => c.projectStage === 'Delivered').length
  };

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.leftHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, margin: 0 }}>ALTA. CRM</h1>
            <button onClick={() => navigate('/admin')} style={styles.adminBtn}>← ADMIN</button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={styles.statBadge}>Total: {stats.total}</div>
            <div style={styles.statBadge}>Active: {stats.active}</div>
            <div style={styles.statBadge}>Delivered: {stats.delivered}</div>
          </div>
        </div>
        
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.stageTabsWrapper}>
            {STAGES.map(stage => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                style={{
                  ...styles.stageTab,
                  background: stageFilter === stage ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: stageFilter === stage ? '#fff' : 'rgba(255,255,255,0.4)'
                }}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.clientList}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Loading...</div>
          ) : filteredClients.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No clients found.</div>
          ) : (
            filteredClients.map(client => {
              const isActive = selectedClient?._id === client._id && !creating;
              return (
                <div
                  key={client._id}
                  onClick={() => selectClient(client)}
                  style={{
                    ...styles.clientCard,
                    borderLeft: `3px solid ${PRIORITY_COLORS[client.priorityLevel] || 'transparent'}`,
                    ...(isActive ? styles.clientCardActive : {})
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{client.clientName}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>{client.businessName || 'No business'}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {client.projectType && (
                      <div style={styles.typeBadge}>{client.projectType}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STAGE_COLORS[client.projectStage] || '#fff' }}></div>
                      {client.projectStage}
                    </div>
                  </div>
                  {client.nextFollowUpDate && (
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                      Follow up: {new Date(client.nextFollowUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={styles.newClientWrapper}>
          <button onClick={startCreate} style={styles.newClientBtn}>+ NEW CLIENT</button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div ref={rightPanelRef} style={styles.rightPanel}>
        {!selectedClient && !creating ? (
          <div style={styles.emptyRightPanel}>Select a client to view details</div>
        ) : (
          <div style={styles.detailContainer}>
            
            {/* Financial Summary Bar */}
            {openSections.financial && (
              <div style={styles.financialSummaryBar}>
                <span>₹{(editedClient.totalProjectValue || 0).toLocaleString('en-IN')} total</span>
                <span> · </span>
                <span style={{ color: '#44c844' }}>₹{(editedClient.advanceReceived || 0).toLocaleString('en-IN')} received</span>
                <span> · </span>
                <span style={{ color: (editedClient.balancePending || 0) > 0 ? '#cc3333' : '#fff' }}>₹{(editedClient.balancePending || 0).toLocaleString('en-IN')} pending</span>
              </div>
            )}

            {/* SECTION 1: CORE CLIENT DETAILS */}
            <SectionHeader title="Core Client Details" isOpen={openSections.core} onToggle={() => toggleSection('core')} />
            {openSections.core && (
              <div style={styles.grid2}>
                <Field label="Client Name" value={editedClient.clientName} onChange={v => handleFieldChange('clientName', v)} />
                <Field label="Business Name" value={editedClient.businessName} onChange={v => handleFieldChange('businessName', v)} />
                <Field label="Email" type="email" value={editedClient.email} onChange={v => handleFieldChange('email', v)} />
                <Field label="Phone" value={editedClient.phone} onChange={v => handleFieldChange('phone', v)} />
                <Field label="City" value={editedClient.city} onChange={v => handleFieldChange('city', v)} />
                <Field label="Country" value={editedClient.country} onChange={v => handleFieldChange('country', v)} />
                <Field label="Business Type" value={editedClient.businessType} onChange={v => handleFieldChange('businessType', v)} />
                <Field label="Website Link" value={editedClient.websiteLink} onChange={v => handleFieldChange('websiteLink', v)} />
                <Field label="Social Links" value={editedClient.socialLinks} onChange={v => handleFieldChange('socialLinks', v)} />
                <SelectField label="Preferred Contact" value={editedClient.preferredContact} options={['Email', 'WhatsApp', 'Call', 'Instagram', 'LinkedIn', '']} onChange={v => handleFieldChange('preferredContact', v)} />
                <Field label="Timezone" value={editedClient.timezone} onChange={v => handleFieldChange('timezone', v)} />
                <SelectField label="Lead Source" value={editedClient.leadSource} options={['Instagram', 'LinkedIn', 'Referral', 'Website', 'Cold Outreach', 'Other', '']} onChange={v => handleFieldChange('leadSource', v)} />
              </div>
            )}

            {/* SECTION 2: PROJECT INFORMATION */}
            <SectionHeader title="Project Information" isOpen={openSections.project} onToggle={() => toggleSection('project')} />
            {openSections.project && (
              <div style={styles.grid2}>
                <SelectField label="Project Type" value={editedClient.projectType} options={['Landing Page', 'Business Website', 'Web App', 'Redesign', 'Speed Optimization', '']} onChange={v => handleFieldChange('projectType', v)} />
                <SelectField label="Project Stage" value={editedClient.projectStage} options={STAGES.filter(s => s !== 'All')} onChange={v => handleFieldChange('projectStage', v)} />
                <Field label="Start Date" type="date" value={formatDateForInput(editedClient.startDate)} onChange={v => handleFieldChange('startDate', v)} />
                <Field label="Target Delivery Date" type="date" value={formatDateForInput(editedClient.targetDeliveryDate)} onChange={v => handleFieldChange('targetDeliveryDate', v)} />
                <SelectField label="Priority Level" value={editedClient.priorityLevel} options={['Low', 'Medium', 'High', 'Urgent', '']} onChange={v => handleFieldChange('priorityLevel', v)} />
                <Field label="Budget Range" value={editedClient.budgetRange} onChange={v => handleFieldChange('budgetRange', v)} />
                <Field label="Package Chosen" value={editedClient.packageChosen} onChange={v => handleFieldChange('packageChosen', v)} />
                <Field label="Add-Ons Selected" value={editedClient.addOnsSelected} onChange={v => handleFieldChange('addOnsSelected', v)} />
              </div>
            )}

            {/* SECTION 3: COMMUNICATION TRACKING */}
            <SectionHeader title="Communication Tracking" isOpen={openSections.communication} onToggle={() => toggleSection('communication')} />
            {openSections.communication && (
              <div style={styles.grid2}>
                <Field label="Last Call Date" type="date" value={formatDateForInput(editedClient.lastCallDate)} onChange={v => handleFieldChange('lastCallDate', v)} />
                <Field label="Last Message Date" type="date" value={formatDateForInput(editedClient.lastMessageDate)} onChange={v => handleFieldChange('lastMessageDate', v)} />
                <Field label="Last Email Date" type="date" value={formatDateForInput(editedClient.lastEmailDate)} onChange={v => handleFieldChange('lastEmailDate', v)} />
                <Field label="Who Spoke Last" value={editedClient.whoSpokeLast} onChange={v => handleFieldChange('whoSpokeLast', v)} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextareaField label="What Was Discussed" value={editedClient.whatWasDiscussed} onChange={v => handleFieldChange('whatWasDiscussed', v)} />
                </div>
                <ToggleField label="Did They Reply" checked={editedClient.didTheyReply} onChange={v => handleFieldChange('didTheyReply', v)} />
                <Field label="Next Follow Up Date" type="date" value={formatDateForInput(editedClient.nextFollowUpDate)} onChange={v => handleFieldChange('nextFollowUpDate', v)} />
                <SelectField label="Follow Up Status" value={editedClient.followUpStatus} options={['Pending', 'Sent', 'Replied', 'Delayed', '']} onChange={v => handleFieldChange('followUpStatus', v)} />
              </div>
            )}

            {/* SECTION 4: WORKFLOW STATUS */}
            <SectionHeader title="Workflow Status" isOpen={openSections.workflow} onToggle={() => toggleSection('workflow')} />
            {openSections.workflow && (
              <div style={styles.grid2}>
                <ToggleField label="Discovery Call Done" checked={editedClient.discoveryCallDone} onChange={v => handleFieldChange('discoveryCallDone', v)} />
                <ToggleField label="Proposal Sent" checked={editedClient.proposalSent} onChange={v => handleFieldChange('proposalSent', v)} />
                <ToggleField label="Proposal Approved" checked={editedClient.proposalApproved} onChange={v => handleFieldChange('proposalApproved', v)} />
                <ToggleField label="Onboarding Call Done" checked={editedClient.onboardingCallDone} onChange={v => handleFieldChange('onboardingCallDone', v)} />
                <ToggleField label="Trigger Form Completed" checked={editedClient.triggerFormCompleted} onChange={v => handleFieldChange('triggerFormCompleted', v)} />
                <ToggleField label="Contract Signed" checked={editedClient.contractSigned} onChange={v => handleFieldChange('contractSigned', v)} />
                <ToggleField label="Invoice Paid" checked={editedClient.invoicePaid} onChange={v => handleFieldChange('invoicePaid', v)} />
                <ToggleField label="Group Chat Created" checked={editedClient.groupChatCreated} onChange={v => handleFieldChange('groupChatCreated', v)} />
                <ToggleField label="First Delivery Sent" checked={editedClient.firstDeliverySent} onChange={v => handleFieldChange('firstDeliverySent', v)} />
                <ToggleField label="Feedback Received" checked={editedClient.feedbackReceived} onChange={v => handleFieldChange('feedbackReceived', v)} />
                <ToggleField label="Revisions Pending" checked={editedClient.revisionsPending} onChange={v => handleFieldChange('revisionsPending', v)} />
                <ToggleField label="Final Delivery Done" checked={editedClient.finalDeliveryDone} onChange={v => handleFieldChange('finalDeliveryDone', v)} />
                <ToggleField label="Maintenance Ongoing" checked={editedClient.maintenanceOngoing} onChange={v => handleFieldChange('maintenanceOngoing', v)} />
              </div>
            )}

            {/* SECTION 5: ASSETS AND ACCESS */}
            <SectionHeader title="Assets and Access" isOpen={openSections.assets} onToggle={() => toggleSection('assets')} />
            {openSections.assets && (
              <div style={styles.grid2}>
                <ToggleField label="Logo Received" checked={editedClient.logoReceived} onChange={v => handleFieldChange('logoReceived', v)} />
                <ToggleField label="Brand Colors Received" checked={editedClient.brandColorsReceived} onChange={v => handleFieldChange('brandColorsReceived', v)} />
                <ToggleField label="Fonts Received" checked={editedClient.fontsReceived} onChange={v => handleFieldChange('fontsReceived', v)} />
                <ToggleField label="Content Received" checked={editedClient.contentReceived} onChange={v => handleFieldChange('contentReceived', v)} />
                <ToggleField label="Images Received" checked={editedClient.imagesReceived} onChange={v => handleFieldChange('imagesReceived', v)} />
                <ToggleField label="Videos Received" checked={editedClient.videosReceived} onChange={v => handleFieldChange('videosReceived', v)} />
                <ToggleField label="Hosting Access Received" checked={editedClient.hostingAccessReceived} onChange={v => handleFieldChange('hostingAccessReceived', v)} />
                <ToggleField label="Domain Access Received" checked={editedClient.domainAccessReceived} onChange={v => handleFieldChange('domainAccessReceived', v)} />
                <ToggleField label="GitHub Access Received" checked={editedClient.githubAccessReceived} onChange={v => handleFieldChange('githubAccessReceived', v)} />
                <ToggleField label="Figma Access Received" checked={editedClient.figmaAccessReceived} onChange={v => handleFieldChange('figmaAccessReceived', v)} />
                <ToggleField label="Admin Panel Access Received" checked={editedClient.adminPanelAccessReceived} onChange={v => handleFieldChange('adminPanelAccessReceived', v)} />
              </div>
            )}

            {/* SECTION 6: TASKS AND NOTES */}
            <SectionHeader title="Tasks and Notes" isOpen={openSections.tasks} onToggle={() => toggleSection('tasks')} />
            {openSections.tasks && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Tasks</div>
                  {(editedClient.todoList || []).map((task, i) => (
                    <div key={i} style={styles.taskRow}>
                      <select style={{ ...styles.input, width: '120px' }} value={task.status} onChange={e => handleTaskChange(i, 'status', e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                      <input style={{ ...styles.input, flex: 1 }} value={task.task} onChange={e => handleTaskChange(i, 'task', e.target.value)} placeholder="Task description..." />
                      <input style={{ ...styles.input, width: '100px' }} value={task.assignedTo} onChange={e => handleTaskChange(i, 'assignedTo', e.target.value)} placeholder="Assigned" />
                      <input type="date" style={{ ...styles.input, width: '130px' }} value={formatDateForInput(task.deadline)} onChange={e => handleTaskChange(i, 'deadline', e.target.value)} />
                      <button onClick={() => deleteTask(i)} style={styles.deleteTaskBtn}>✕</button>
                    </div>
                  ))}
                  <button onClick={addTask} style={styles.addTaskBtn}>+ Add Task</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <TextareaField label="YOUR NOTES" value={editedClient.internalNotes} onChange={v => handleFieldChange('internalNotes', v)} />
                  <TextareaField label="CLIENT SAID" value={editedClient.clientNotes} onChange={v => handleFieldChange('clientNotes', v)} />
                  <TextareaField label="BLOCKERS" value={editedClient.blockers} onChange={v => handleFieldChange('blockers', v)} />
                </div>

                <div style={{ ...styles.grid2, marginTop: '16px' }}>
                  <SelectField label="Risk Level" value={editedClient.riskLevel} options={['Low', 'Medium', 'High', '']} onChange={v => handleFieldChange('riskLevel', v)} />
                  <SelectField label="Waiting On" value={editedClient.waitingOn} options={['Client', 'Team', 'Neither', '']} onChange={v => handleFieldChange('waitingOn', v)} />
                </div>
              </div>
            )}

            {/* SECTION 7: FINANCIAL TRACKING */}
            <SectionHeader title="Financial Tracking" isOpen={openSections.financial} onToggle={() => toggleSection('financial')} />
            {openSections.financial && (
              <div style={styles.grid2}>
                <Field label="Total Project Value (₹)" type="number" value={editedClient.totalProjectValue} onChange={v => handleFieldChange('totalProjectValue', v)} />
                <Field label="Advance Received (₹)" type="number" value={editedClient.advanceReceived} onChange={v => handleFieldChange('advanceReceived', v)} />
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={styles.label}>Balance Pending (₹) - Auto Calculated</div>
                  <div style={{
                    ...styles.input, 
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: editedClient.balancePending > 0 ? '#cc3333' : '#44c844',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {editedClient.balancePending?.toLocaleString('en-IN') || 0}
                  </div>
                </div>

                <SelectField label="Invoice Status" value={editedClient.invoiceStatus} options={['Not Sent', 'Sent', 'Partially Paid', 'Paid', 'Overdue', '']} onChange={v => handleFieldChange('invoiceStatus', v)} />
                <Field label="Payment Due Date" type="date" value={formatDateForInput(editedClient.paymentDueDate)} onChange={v => handleFieldChange('paymentDueDate', v)} />
                <SelectField label="Payment Method" value={editedClient.paymentMethod} options={['UPI', 'Bank Transfer', 'PayPal', 'Razorpay', 'Cash', 'Other', '']} onChange={v => handleFieldChange('paymentMethod', v)} />
                <ToggleField label="Revision Policy Accepted" checked={editedClient.revisionPolicyAccepted} onChange={v => handleFieldChange('revisionPolicyAccepted', v)} />
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {!creating && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={handleDelete} style={styles.deleteBtn}>DELETE CLIENT</button>
                  <button
                    onClick={handleExportPDF}
                    disabled={generatingPDF}
                    style={{
                      background: generatingPDF ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: generatingPDF ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: generatingPDF ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {generatingPDF ? '⏳ Generating...' : '↓ Export PDF'}
                  </button>
                </div>
              )}
              {errorMsg && <div style={{ color: '#cc3333', fontSize: '13px' }}>{errorMsg}</div>}
              {successMsg && <div style={{ color: '#44c844', fontSize: '13px' }}>{successMsg}</div>}
            </div>

            {/* Floating Save Button */}
            {isDirty && (
              <button onClick={handleSave} style={styles.saveBtn}>
                {creating ? 'CREATE CLIENT' : 'SAVE CHANGES'}
              </button>
            )}

          </div>
        )}
      </div>

      {selectedClient && (
        <div
          id="client-report-template"
          style={{
            position: 'fixed',
            top: '-99999px',
            left: '-99999px',
            width: '794px',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        >
          <ClientReportTemplate client={selectedClient} />
        </div>
      )}
    </div>
  );
};

// UI Components

const SectionHeader = ({ title, isOpen, onToggle }) => (
  <div onClick={onToggle} style={styles.sectionHeader}>
    <span>{isOpen ? '▾' : '▸'} {title}</span>
  </div>
);

const Field = ({ label, type = 'text', value, onChange }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={styles.label}>{label}</div>
    <input 
      type={type} 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      style={styles.input}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={styles.label}>{label}</div>
    <select value={value || ''} onChange={e => onChange(e.target.value)} style={styles.input}>
      {options.map(opt => <option key={opt} value={opt}>{opt || 'None'}</option>)}
    </select>
  </div>
);

const TextareaField = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '16px', width: '100%' }}>
    <div style={styles.label}>{label}</div>
    <textarea 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      style={styles.textarea}
    />
  </div>
);

const ToggleField = ({ label, checked, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }} onClick={() => onChange(!checked)}>
    <div style={{
      width: '18px', height: '18px', borderRadius: '4px',
      border: checked ? 'none' : '1px solid rgba(255,255,255,0.3)',
      background: checked ? '#cc3333' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {checked && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
    </div>
    <span style={{ fontSize: '13px', color: checked ? '#fff' : 'rgba(255,255,255,0.35)' }}>{label}</span>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: '#000000',
    color: '#ffffff',
    fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    overflow: 'hidden'
  },
  leftPanel: {
    width: '300px',
    flexShrink: 0,
    background: '#0d0d0d',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  leftHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  adminBtn: {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)',
    fontSize: '10px', cursor: 'pointer', padding: 0
  },
  statBadge: {
    background: 'rgba(204,51,51,0.1)', color: '#cc3333', padding: '4px 8px',
    borderRadius: '4px', fontSize: '10px', fontWeight: 600
  },
  searchInput: {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '10px 12px', borderRadius: '6px', color: '#fff', fontSize: '13px',
    outline: 'none', marginBottom: '12px'
  },
  stageTabsWrapper: {
    display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px',
    scrollbarWidth: 'none', msOverflowStyle: 'none'
  },
  stageTab: {
    border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px',
    fontSize: '11px', whiteSpace: 'nowrap', cursor: 'pointer'
  },
  clientList: {
    flex: 1, overflowY: 'auto', paddingBottom: '60px' // Space for new client button
  },
  clientCard: {
    padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer', transition: 'background 0.2s'
  },
  clientCardActive: {
    background: 'rgba(204,51,51,0.06)'
  },
  typeBadge: {
    border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px',
    fontSize: '10px', color: 'rgba(255,255,255,0.6)'
  },
  newClientWrapper: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px',
    background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  newClientBtn: {
    width: '100%', height: '44px', background: 'rgba(204,51,51,0.12)',
    border: '1px solid rgba(204,51,51,0.3)', color: '#cc3333',
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em',
    fontWeight: 700, borderRadius: '8px', cursor: 'pointer'
  },
  rightPanel: {
    flex: 1, overflowY: 'auto', padding: '32px', position: 'relative'
  },
  emptyRightPanel: {
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.45)', fontSize: '14px'
  },
  detailContainer: {
    maxWidth: '800px', margin: '0 auto', paddingBottom: '100px'
  },
  financialSummaryBar: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
    padding: '16px', borderRadius: '8px', marginBottom: '24px',
    fontSize: '14px', fontWeight: 600, display: 'flex', gap: '12px', alignItems: 'center'
  },
  sectionHeader: {
    fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '8px', marginBottom: '16px', cursor: 'pointer', userSelect: 'none'
  },
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: '32px'
  },
  label: {
    fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase'
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 12px', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none'
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    padding: '12px', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none',
    minHeight: '80px', resize: 'vertical', lineHeight: 1.6
  },
  taskRow: {
    display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center'
  },
  addTaskBtn: {
    background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '6px',
    fontSize: '12px', cursor: 'pointer', marginTop: '8px'
  },
  deleteTaskBtn: {
    background: 'transparent', border: 'none', color: '#cc3333', cursor: 'pointer', fontSize: '14px', padding: '0 8px'
  },
  deleteBtn: {
    color: 'rgba(255,255,255,0.2)', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)', padding: '8px 16px',
    fontSize: '10px', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer'
  },
  saveBtn: {
    position: 'fixed', bottom: '32px', right: '32px',
    background: '#cc3333', color: '#fff', border: 'none',
    padding: '12px 28px', borderRadius: '8px', fontSize: '11px',
    textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 12px rgba(204,51,51,0.3)', zIndex: 100
  }
};

export default CRMPage;
