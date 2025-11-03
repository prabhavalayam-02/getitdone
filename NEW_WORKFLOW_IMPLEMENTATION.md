# New Task Approval Workflow Implementation

## 📋 Overview

The system has been completely redesigned to include a **helper approval workflow** where taskers can review and approve helpers before tasks start.

---

## 🔄 New Workflow

### Old Flow:
1. Helper clicks "Accept" → Task removed from available tasks
2. Helper sees "Start Task" button
3. Helper completes task

### **New Flow** ✨:
1. **Helper clicks "Accept"** → Task status becomes `pending-approval`
2. **Task STAYS in available tasks** (visible to other helpers too)
3. **Tasker receives email** with Approve/Reject buttons
4. **Tasker reviews helper** (rating, completed tasks, profile)
5. **If APPROVED**:
   - Task status → `in-progress`
   - Helper gets approval email
   - Task removed from available tasks
   - Task automatically starts (no "Start Task" button needed)
6. **If REJECTED**:
   - Task status → `open`
   - Helper removed from task
   - Task remains in available tasks
7. **Helper completes task** → Tasker gets completion email

---

## ✅ Backend Changes Completed

### 1. Task Model Updated
**File**: `models/Task.js`

**New Status Added**:
```javascript
enum: ["open", "pending-approval", "in-progress", "completed", "cancelled"]
```

**Removed**: "accepted" status (no longer used)

---

### 2. New API Endpoints

#### **POST `/api/tasks/:id/approve-helper`**
- **Who can use**: Task owner only
- **What it does**: 
  - Changes status from `pending-approval` to `in-progress`
  - Sends approval email to helper
- **Returns**: Updated task object

#### **POST `/api/tasks/:id/reject-helper`**
- **Who can use**: Task owner only
- **What it does**:
  - Changes status back to `open`
  - Removes `acceptedBy` field
  - Task becomes available again
- **Returns**: Updated task object

---

### 3. Modified Endpoints

#### **POST `/api/tasks/:id/accept`** (UPDATED)
- **Old behavior**: Status → "accepted", task removed from available
- **New behavior**: 
  - Status → "pending-approval"
  - Task stays in available tasks
  - Sends request email to tasker with approve/reject links
  - Response message: "Task request sent to owner. Awaiting approval."

#### **POST `/api/tasks/:id/complete`** (UPDATED)
- **Old check**: Task must be "accepted" or "in-progress"
- **New check**: Task must be "in-progress" only
- **Error message**: "You can only complete tasks that are in-progress and assigned to you"

---

### 4. Email Templates Updated

#### **Task Request Email** (sent to tasker)
**Subject**: "Helper Request for Task: [Task Title]"

**Contains**:
- Task details (title, description, budget, location)
- Helper information:
  - Name, email, phone
  - **Completed tasks count**
  - **Rating** (with total reviews) or "New helper" badge
- **Action buttons**:
  - ✓ Approve Helper (green button)
  - ✗ Reject (red button)
- Links to: `/user/approve-helper/:taskId` and `/user/reject-helper/:taskId`

#### **Helper Approved Email** (NEW - sent to helper)
**Subject**: "Congratulations! You've been approved for: [Task Title]"

**Contains**:
- Celebration message 🎉
- Task details
- Task owner contact information
- Next steps:
  - Task automatically started
  - Coordinate with owner
  - Complete and earn payment
- Button: "View My Tasks"

---

## 🎨 Frontend Changes Needed

### 1. AvailableTasksPage.tsx (Helper View)
**File**: `src/pages/helper/AvailableTasksPage.tsx`

**Current issue**: Tasks with "pending-approval" status are being filtered out

**Fix needed**:
```typescript
// OLD: Only show "open" tasks
const availableTasks = await tasksAPI.getTasks({ status: 'open' });

// NEW: Show both "open" and "pending-approval" tasks
const availableTasks = await tasksAPI.getTasks({ 
  status: { $in: ['open', 'pending-approval'] } 
});

// OR filter in frontend:
const availableTasks = await tasksAPI.getTasks();
const filtered = availableTasks.filter(task => 
  task.status === 'open' || task.status === 'pending-approval'
);
```

**Add status badge**:
```typescript
{task.status === 'pending-approval' && (
  <Badge className="bg-yellow-100 text-yellow-800">
    Awaiting Approval
  </Badge>
)}
```

---

### 2. TaskCard.tsx Component
**File**: `src/components/ui/TaskCard.tsx`

**Remove**: "Start Task" button (lines 82-92)

```typescript
// DELETE THIS CODE:
} else if (task.status === 'accepted') {
  return (
    <Button 
      variant="success" 
      size="sm" 
      onClick={() => onStart?.(task._id || task.id!)}
    >
      <Play className="h-4 w-4 mr-1" />
      Start Task
    </Button>
  );
}
```

**Update**: Keep only "Accept" and "Complete" buttons

```typescript
// Helper role actions:
case 'helper':
  if (task.status === 'open') {
    return <Button onClick={onAccept}>Accept Task</Button>;
  } else if (task.status === 'pending-approval') {
    return <Badge>Awaiting Approval</Badge>;
  } else if (task.status === 'in-progress') {
    return <Button onClick={onComplete}>Complete</Button>;
  }
  return null;
```

---

### 3. MyTasksPage.tsx (User/Tasker View)
**File**: `src/pages/user/MyTasksPage.tsx`

**Add**: Approve/Reject buttons for tasks with "pending-approval" status

```typescript
const handleApproveHelper = async (taskId: string) => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve-helper`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      toast({
        title: "Helper Approved",
        description: "The helper has been notified and task has started.",
      });
      loadTasks(); // Reload tasks
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to approve helper",
    });
  }
};

const handleRejectHelper = async (taskId: string) => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/reject-helper`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      toast({
        title: "Helper Rejected",
        description: "Task is now available for other helpers.",
      });
      loadTasks();
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to reject helper",
    });
  }
};
```

**Update TaskCard** to show approve/reject buttons:
```typescript
<TaskCard
  task={task}
  userRole="user"
  onApprove={handleApproveHelper}
  onReject={handleRejectHelper}
  onRate={handleRateTask}
/>
```

**In TaskCard, add for user role**:
```typescript
case 'user':
  if (task.status === 'pending-approval') {
    return (
      <div className="flex gap-2">
        <Button 
          variant="success" 
          size="sm" 
          onClick={() => onApprove?.(task._id)}
        >
          ✓ Approve Helper
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onReject?.(task._id)}
        >
          ✗ Reject
        </Button>
      </div>
    );
  } else if (task.status === 'open') {
    return <Button variant="destructive" onClick={onDelete}>Delete</Button>;
  }
  return null;
```

---

### 4. Create Approve/Reject Pages (for email links)
**Files**: 
- `src/pages/user/ApproveHelperPage.tsx`
- `src/pages/user/RejectHelperPage.tsx`

**Purpose**: Handle approve/reject actions when user clicks email links

**ApproveHelperPage.tsx**:
```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ApproveHelperPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const approveHelper = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve-helper`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          // Redirect to my tasks with success message
          navigate('/user/my-tasks?approved=true');
        } else {
          navigate('/user/my-tasks?error=approve-failed');
        }
      } catch (error) {
        navigate('/user/my-tasks?error=network');
      }
    };

    if (taskId) {
      approveHelper();
    }
  }, [taskId, navigate]);

  return <div>Approving helper...</div>;
};

export default ApproveHelperPage;
```

**Add routes in App.tsx**:
```typescript
<Route path="/user/approve-helper/:taskId" element={<ApproveHelperPage />} />
<Route path="/user/reject-helper/:taskId" element={<RejectHelperPage />} />
```

---

### 5. Helper MyTasksPage Updates
**File**: `src/pages/helper/HelperMyTasksPage.tsx`

**Update status filter** to include "pending-approval" and "in-progress":
```typescript
const getStatusCounts = () => {
  return {
    all: tasks.length,
    'pending-approval': tasks.filter(task => task.status === 'pending-approval').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };
};
```

**Add status badge**:
```typescript
<SelectItem value="pending-approval">
  Awaiting Approval ({statusCounts['pending-approval']})
</SelectItem>
```

---

## 🧪 Testing Guide

### Test 1: Helper Request Flow
1. **As Helper**: Browse available tasks
2. Click "Accept Task"
3. **Verify**: 
   - ✓ Toast: "Task request sent to owner. Awaiting approval."
   - ✓ Task still visible in available tasks with "Awaiting Approval" badge
   - ✓ Task appears in helper's "My Tasks" with "pending-approval" status

### Test 2: Email Notification
1. **Check tasker's email**: prabhavalayam@gmail.com
2. **Verify email contains**:
   - Task details
   - Helper info (name, email, phone, rating, completed tasks)
   - Green "Approve" button
   - Red "Reject" button

### Test 3: Tasker Approves Helper
1. **As Tasker**: Go to My Tasks
2. Find task with "pending-approval" status
3. Click "Approve Helper" button
4. **Verify**:
   - ✓ Toast: "Helper approved successfully"
   - ✓ Task status → "in-progress"
   - ✓ Helper gets approval email
   - ✓ Task removed from available tasks

### Test 4: Helper Completes Task
1. **As Helper**: Go to My Tasks
2. Find task with "in-progress" status (no "Start" button)
3. Click "Complete" button
4. **Verify**:
   - ✓ Task marked as completed
   - ✓ Helper stats updated
   - ✓ Tasker gets completion email

### Test 5: Tasker Rejects Helper
1. **As Tasker**: Go to My Tasks
2. Find task with "pending-approval" status
3. Click "Reject" button
4. **Verify**:
   - ✓ Task status → "open"
   - ✓ Helper removed from task
   - ✓ Task appears in available tasks again

---

## 📊 Status Flow Diagram

```
OPEN 
  ↓ (Helper clicks Accept)
PENDING-APPROVAL
  ↓ (Tasker Approves)      ↓ (Tasker Rejects)
IN-PROGRESS                OPEN (back to start)
  ↓ (Helper Completes)
COMPLETED
```

---

## 🎯 Summary of Changes

### Backend: ✅ COMPLETE
- ✅ Task model updated with "pending-approval" status
- ✅ Accept task endpoint updated
- ✅ Approve helper endpoint created
- ✅ Reject helper endpoint created
- ✅ Complete task endpoint updated
- ✅ Email templates updated
- ✅ Helper approved email created

### Frontend: ⏳ TO DO
- [ ] Update AvailableTasksPage to show pending-approval tasks
- [ ] Remove "Start Task" button from TaskCard
- [ ] Add approve/reject buttons in MyTasksPage (user view)
- [ ] Create ApproveHelperPage component
- [ ] Create RejectHelperPage component
- [ ] Add routes for approve/reject pages
- [ ] Update HelperMyTasksPage status filters
- [ ] Update TaskCard component logic
- [ ] Add pending-approval status badges

---

## 🚀 Next Steps

1. Update frontend components as listed above
2. Test the complete workflow
3. Verify email notifications work
4. Test approve/reject from email links
5. Ensure all status transitions work correctly

---

**Backend Server**: ✅ Running with new workflow
**Email Service**: ✅ Configured and working
**Ready for frontend integration**: ✅ YES

