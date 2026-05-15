import React from 'react';
import altaLogo from '../assets/Alta-logo.png';

const ClientReportTemplate = ({ client }) => {
  if (!client) return null;

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const today = new Date();
  const formatToday = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Stage Badge Logic
  const getStageStyle = (stage) => {
    const styles = {
      'Lead': { bg: '#e0e7ff', text: '#4338ca' },
      'Discovery': { bg: '#fef3c7', text: '#d97706' },
      'Proposal': { bg: '#fce7f3', text: '#be185d' },
      'Onboarding': { bg: '#dcfce7', text: '#16a34a' },
      'In Progress': { bg: '#dbeafe', text: '#1d4ed8' },
      'Review': { bg: '#fef9c3', text: '#ca8a04' },
      'Delivered': { bg: '#d1fae5', text: '#065f46' },
      'Closed': { bg: '#f3f4f6', text: '#6b7280' },
    };
    return styles[stage] || { bg: '#f3f4f6', text: '#6b7280' };
  };
  const stageStyle = getStageStyle(client.projectStage);

  // Risk Badge Logic
  const getRiskStyle = (risk) => {
    const styles = {
      'Low': { bg: '#dcfce7', text: '#16a34a' },
      'Medium': { bg: '#fef3c7', text: '#d97706' },
      'High': { bg: '#fee2e2', text: '#dc2626' }
    };
    return styles[risk] || styles['Low'];
  };
  const riskStyle = getRiskStyle(client.riskLevel || 'Low');

  // Timeline Progress Calculation
  let timelineProgress = 0;
  let remainingDaysStr = 'N/A';
  let remainingDaysColor = '#6b7280';
  
  if (client.startDate && client.targetDeliveryDate) {
    const start = new Date(client.startDate);
    const target = new Date(client.targetDeliveryDate);
    const totalDuration = target - start;
    const elapsed = today - start;
    
    if (totalDuration > 0) {
      timelineProgress = (elapsed / totalDuration) * 100;
      if (timelineProgress < 0) timelineProgress = 0;
      if (timelineProgress > 100) timelineProgress = 100;
    }

    const remainingTime = target - today;
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    
    if (remainingDays >= 0) {
      remainingDaysStr = `${remainingDays} days remaining`;
      remainingDaysColor = '#16a34a';
    } else {
      remainingDaysStr = `Overdue by ${Math.abs(remainingDays)} days`;
      remainingDaysColor = '#dc2626';
    }
  }

  // Milestones
  const milestones = [
    { label: 'Discovery Call', done: client.discoveryCallDone },
    { label: 'Proposal Sent', done: client.proposalSent },
    { label: 'Proposal Approved', done: client.proposalApproved },
    { label: 'Onboarding Call', done: client.onboardingCallDone },
    { label: 'Trigger Form', done: client.triggerFormCompleted },
    { label: 'Contract Signed', done: client.contractSigned },
    { label: 'Invoice Paid', done: client.invoicePaid },
    { label: 'Group Chat', done: client.groupChatCreated },
    { label: 'First Delivery', done: client.firstDeliverySent },
    { label: 'Feedback Received', done: client.feedbackReceived },
    { label: 'Revisions Pending', done: client.revisionsPending },
    { label: 'Final Delivery', done: client.finalDeliveryDone },
    { label: 'Maintenance Ongoing', done: client.maintenanceOngoing },
  ];
  const completedMilestones = milestones.filter(m => m.done).length;

  // Assets
  const assets = [
    { label: 'Logo', done: client.logoReceived },
    { label: 'Brand Colors', done: client.brandColorsReceived },
    { label: 'Fonts', done: client.fontsReceived },
    { label: 'Content', done: client.contentReceived },
    { label: 'Images', done: client.imagesReceived },
    { label: 'Videos', done: client.videosReceived },
    { label: 'Hosting Access', done: client.hostingAccessReceived },
    { label: 'Domain Access', done: client.domainAccessReceived },
  ];
  const completedAssets = assets.filter(a => a.done).length;
  let assetColor = '#dc2626';
  if (completedAssets === assets.length) assetColor = '#16a34a';
  else if (completedAssets >= 5) assetColor = '#d97706';

  // Tasks
  const todoList = client.todoList || [];
  const completedTasks = todoList.filter(t => t.status === 'Done');
  const inProgressTasks = todoList.filter(t => t.status === 'In Progress');
  const pendingTasks = todoList.filter(t => t.status === 'Blocked');

  // Payments
  const totalValue = client.totalProjectValue || 0;
  const received = client.advanceReceived || 0;
  const pending = totalValue - received;
  
  let paymentProgress = 0;
  if (totalValue > 0) {
    paymentProgress = (received / totalValue) * 100;
    if (paymentProgress > 100) paymentProgress = 100;
  }

  // Action Required Logic
  const actionItems = [];
  if (client.revisionsPending) actionItems.push("📝 Revisions are pending — please review and share feedback");
  if (client.waitingOn === 'Client') actionItems.push("⏳ Our team is waiting for your response to continue");
  if (!client.invoicePaid && pending > 0) actionItems.push(`💳 Payment of ₹${pending.toLocaleString('en-IN')} is pending`);
  if (client.nextFollowUpDate) {
    const followUp = new Date(client.nextFollowUpDate);
    const diffTime = followUp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 3) {
      actionItems.push(`📅 Follow-up scheduled for ${formatDate(client.nextFollowUpDate)} — please keep this time free`);
    }
  }

  return (
    <div style={{
      width: '794px',
      minWidth: '794px',
      padding: '28px',
      background: '#f8f9fb',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      color: '#111827',
      boxSizing: 'border-box'
    }}>
      {/* HEADER BANNER */}
      <div style={{
        height: '100px',
        padding: '24px 32px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={altaLogo} alt="Alta Logo" style={{ height: '44px', objectFit: 'contain' }} />
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            CLIENT PROGRESS REPORT
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>{client.clientName || 'Client'}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{client.businessName || 'Business'}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Generated: {formatToday}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* ROW 1: Stat Cards */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280' }}>PROJECT STAGE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: '1.1', marginBottom: '8px', letterSpacing: '-0.02em', marginTop: '8px' }}>{client.projectStage || 'N/A'}</div>
            <div style={{ display: 'inline-block', background: 'none', border: 'none', padding: '0', borderRadius: '0', fontSize: '13px', fontWeight: '700', color: stageStyle.text, marginTop: '6px' }}>Current Phase</div>
          </div>
          
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280' }}>CURRENT REVISION</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: '1.1', marginBottom: '8px', letterSpacing: '-0.02em', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cc3333' }}></div>
              Round {client.currentRevisionRound || 1}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Revision tracking</div>
          </div>
          
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280' }}>RISK LEVEL</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: '1.1', marginBottom: '8px', letterSpacing: '-0.02em', marginTop: '8px' }}>{client.riskLevel || 'Low'}</div>
            <div style={{ display: 'inline-block', background: 'none', border: 'none', padding: '0', fontSize: '13px', fontWeight: '700', color: riskStyle.text, marginTop: '4px' }}>
              {client.riskLevel || 'Low'}
            </div>
          </div>
        </div>

        {/* ROW 2: Timeline & Approval */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          {/* TIMELINE */}
          <div style={{ width: '60%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>PROJECT TIMELINE</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Start Date</div>
                <div style={{ background: '#f3f4f6', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                  {formatDate(client.startDate)}
                </div>
              </div>
              <div style={{ color: '#6b7280', display: 'flex', alignItems: 'center' }}>→</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Target Delivery</div>
                <div style={{ background: '#f3f4f6', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                  {formatDate(client.targetDeliveryDate)}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#374151' }}>Timeline Progress</span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{Math.round(timelineProgress)}% elapsed</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#cc3333', height: '100%', width: `${timelineProgress}%`, borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <div style={{ fontSize: '13px', fontWeight: 600, color: remainingDaysColor, textAlign: 'right' }}>
              {remainingDaysStr}
            </div>
          </div>

          {/* APPROVAL STATUS */}
          <div style={{ width: '40%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>APPROVAL STATUS</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Proposal Approved', val: client.proposalApproved },
                { label: 'Contract Signed', val: client.contractSigned },
                { label: 'Final Delivery', val: client.finalDeliveryDone },
                { label: 'Revision Policy', val: client.revisionPolicyAccepted }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none', marginBottom: '0', paddingBottom: '10px', marginTop: '0', paddingTop: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                  <span style={{ 
                    fontSize: '12px', fontWeight: '700',
                    color: item.val ? '#16a34a' : '#d97706',
                    background: 'none', border: 'none', padding: '0',
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                    {item.val ? '✓ Approved' : '○ Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Milestones */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>MILESTONES & WORKFLOW</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: '32px', rowGap: '14px', width: '100%', marginBottom: '20px', alignItems: 'start' }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '20px' }}>
                  {m.done ? (
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#16a34a', lineHeight: '1.3', wordBreak: 'break-word' }}>{m.label}</span>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280', lineHeight: '1.3', wordBreak: 'break-word' }}>{m.label}</span>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>Progress Summary</span>
                <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#16a34a', width: `${(completedMilestones / milestones.length) * 100}%`, maxWidth: '100%' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>{completedMilestones} of {milestones.length} milestones</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Latest Update & Assets */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '50%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>LATEST UPDATE</div>
            <div style={{ background: '#f9fafb', borderLeft: '3px solid #cc3333', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
              {client.whatWasDiscussed ? client.whatWasDiscussed : <span style={{ color: '#9ca3af' }}>No updates recorded yet.</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginTop: '4px' }}>Last discussed with: <span style={{ fontWeight: 600 }}>{client.whoSpokeLast || 'N/A'}</span></div>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginTop: '4px' }}>Last call: <span style={{ fontWeight: 600 }}>{formatDate(client.lastCallDate)}</span></div>
            </div>
          </div>

          <div style={{ width: '50%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>ASSETS RECEIVED</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {assets.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: a.done ? '#16a34a' : '#dc2626', fontSize: '12px', fontWeight: 700 }}>{a.done ? '✓' : '✗'}</span>
                  <span style={{ fontSize: '12px', color: '#374151' }}>{a.label}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: assetColor, marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
              {completedAssets} of {assets.length} assets received
            </div>
          </div>
        </div>

        {/* ROW 5: Todo Lists */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderLeft: '4px solid #16a34a', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>✓ COMPLETED</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completedTasks.length > 0 ? completedTasks.map((t, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> {t.task}
                </div>
              )) : <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>All clear — nothing here yet</div>}
            </div>
          </div>
          
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderLeft: '4px solid #1d4ed8', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>⟳ IN PROGRESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inProgressTasks.length > 0 ? inProgressTasks.map((t, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '6px' }}>
                  <span>⏳</span> {t.task}
                </div>
              )) : <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>No active tasks right now</div>}
            </div>
          </div>
          
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e8eaed', borderLeft: '4px solid #cc3333', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>⚠ PENDING FROM CLIENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {client.blockers && (
                <div style={{ fontSize: '12px', color: '#374151', padding: '8px', background: '#fee2e2', borderRadius: '6px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#dc2626' }}>Blocker:</span> {client.blockers}
                </div>
              )}
              {client.waitingOn === 'Client' && (
                <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, marginBottom: '8px' }}>
                  Awaiting client response
                </div>
              )}
              {pendingTasks.map((t, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#cc3333' }}>⚠</span> {t.task}
                </div>
              ))}
              {!client.blockers && client.waitingOn !== 'Client' && pendingTasks.length === 0 && (
                <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Nothing pending from you</div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 6: Meeting Notes */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>MEETING NOTES SUMMARY</div>
            <div style={{ background: '#fffbeb', borderLeft: '4px solid #d97706', padding: '16px 20px', borderRadius: '0 12px 12px 0', fontSize: '13px', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>
              {client.clientNotes ? client.clientNotes : <span style={{ color: '#9ca3af', fontStyle: 'normal' }}>No meeting notes recorded.</span>}
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginTop: '4px' }}>Next follow-up: <span style={{ fontWeight: 600 }}>{formatDate(client.nextFollowUpDate)}</span></div>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginTop: '4px' }}>•</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginTop: '4px' }}>
                Follow-up status: 
                <span style={{ 
                  background: 'none', border: 'none', padding: '0', borderRadius: '0', 
                  fontSize: '13px', fontWeight: '700', 
                  color: client.followUpStatus === 'Pending' ? '#d97706' : client.followUpStatus === 'Sent' ? '#1d4ed8' : client.followUpStatus === 'Replied' ? '#16a34a' : client.followUpStatus === 'Delayed' ? '#dc2626' : '#374151' 
                }}>
                  {client.followUpStatus || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 7: Links & Payments */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '50%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>LINKS & ACCESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                {client.websiteLink && client.websiteLink !== 'N/A' ? (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ background: '#eff6ff', color: '#2563eb', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>🔗 View Live Preview</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {client.websiteLink}
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '12px', color: '#9ca3af', 
                    marginBottom: '12px', fontStyle: 'italic' 
                  }}>
                    Live preview not available yet
                  </div>
                )}
              </div>

              <div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'inline-block', marginBottom: '4px' }}>
                  📝 Submit Feedback Form
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>Link will be shared separately</div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', color: '#374151' }}>💬 {client.preferredContact || 'To be confirmed'}</div>
                <div style={{ fontSize: '13px', color: '#374151' }}>👤 Aenish Khullar — AltaWeb Studio</div>
                <div style={{ fontSize: '13px', color: '#374151' }}>📧 Contact via website</div>
              </div>

            </div>
          </div>

          <div style={{ width: '50%', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#cc3333', fontWeight: '700', marginBottom: '16px', display: 'block' }}>PAYMENT SUMMARY</div>
            
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', marginBottom: '4px', whiteSpace: 'nowrap' }}>Total Value</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', lineHeight: '1', whiteSpace: 'nowrap' }}>₹{totalValue.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', marginBottom: '4px', whiteSpace: 'nowrap' }}>Received</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', lineHeight: '1', whiteSpace: 'nowrap' }}>₹{received.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', marginBottom: '4px', whiteSpace: 'nowrap' }}>Pending</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: pending > 0 ? '#dc2626' : '#16a34a', lineHeight: '1', whiteSpace: 'nowrap' }}>₹{pending.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', marginBottom: '0', paddingBottom: '10px', marginTop: '0' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Invoice Status:</span>
                <span style={{ background: 'none', border: 'none', padding: '0', borderRadius: '0', fontSize: '13px', fontWeight: '700', color: client.invoiceStatus === 'Paid' ? '#16a34a' : client.invoiceStatus === 'Pending' ? '#d97706' : client.invoiceStatus === 'Overdue' ? '#dc2626' : '#374151' }}>
                  {client.invoiceStatus || 'Not specified'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', marginBottom: '0', paddingBottom: '10px', marginTop: '0' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Payment Due:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{formatDate(client.paymentDueDate)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', marginBottom: '0', paddingBottom: '10px', marginTop: '0' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Payment Method:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{client.paymentMethod || 'Not specified'}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#374151' }}>Payment received: {Math.round(paymentProgress)}%</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ background: '#16a34a', height: '100%', width: `${paymentProgress}%`, borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 8: Action Required */}
        {actionItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#ea580c', fontWeight: 700, marginBottom: '16px' }}>⚡ ACTION REQUIRED FROM YOU</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {actionItems.map((item, i) => {
                  const firstSpace = item.indexOf(' ');
                  const icon = item.substring(0, firstSpace);
                  const text = item.substring(firstSpace + 1);
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', padding: '8px 12px', background: 'rgba(234,88,12,0.06)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: '1.5' }}>{icon}</span>
                      <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', flex: 1 }}>{text}</span>
                    </div>
                  );
                })}
              </div>
              {client.targetDeliveryDate && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #fed7aa', fontSize: '14px', fontWeight: 600, color: '#c2410c' }}>
                  📦 Expected next delivery: {formatDate(client.targetDeliveryDate)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginBottom: '16px', alignItems: 'stretch', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ No action needed right now — you're all caught up!
              </div>
              {client.targetDeliveryDate && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #bbf7d0', fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                  📦 Expected next delivery: {formatDate(client.targetDeliveryDate)}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{
        background: '#1a1a2e',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={altaLogo} alt="Alta Logo" style={{ height: '28px', filter: 'brightness(10)', objectFit: 'contain' }} />
          <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>AltaWeb Studio</div>
        </div>
        
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          This report is confidential and prepared exclusively for {client.clientName || 'Client'}
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>altawebstudio.com</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{formatToday}</div>
        </div>
      </div>
    </div>
  );
};

export default ClientReportTemplate;
