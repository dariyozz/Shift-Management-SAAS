-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER PROFILES POLICIES
-- =============================================

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- BUSINESSES POLICIES
-- =============================================

-- Business members can view their business
CREATE POLICY "Business members can view business" ON public.businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = businesses.id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

-- Only owners can update business details
CREATE POLICY "Owners can update business" ON public.businesses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = businesses.id
            AND user_id = auth.uid()
            AND role = 'owner'
            AND is_active = true
        )
    );

-- Authenticated users can create businesses
CREATE POLICY "Authenticated users can create business" ON public.businesses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- SUBSCRIPTIONS POLICIES
-- =============================================

-- Business owners and managers can view subscription
CREATE POLICY "Business owners/managers can view subscription" ON public.subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = subscriptions.business_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'manager')
            AND is_active = true
        )
    );

-- Only owners can update subscription
CREATE POLICY "Owners can update subscription" ON public.subscriptions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = subscriptions.business_id
            AND user_id = auth.uid()
            AND role = 'owner'
            AND is_active = true
        )
    );

-- =============================================
-- BUSINESS MEMBERS POLICIES
-- =============================================

-- Business members can view other members in their business
CREATE POLICY "Business members can view team" ON public.business_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members bm
            WHERE bm.business_id = business_members.business_id
            AND bm.user_id = auth.uid()
            AND bm.is_active = true
        )
    );

-- Owners and managers can manage team members
CREATE POLICY "Owners/managers can manage team" ON public.business_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = business_members.business_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'manager')
            AND is_active = true
        )
    );

-- Users can update their own member record (limited fields)
CREATE POLICY "Users can update own member info" ON public.business_members
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- =============================================
-- INVITATIONS POLICIES
-- =============================================

-- Owners and managers can view and manage invitations
CREATE POLICY "Owners/managers can manage invitations" ON public.invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = invitations.business_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'manager')
            AND is_active = true
        )
    );

-- Anyone can view invitations by token (for accepting)
CREATE POLICY "Anyone can view invitation by token" ON public.invitations
    FOR SELECT USING (true);

-- =============================================
-- EMPLOYEE AVAILABILITY POLICIES
-- =============================================

-- Business members can view availability in their business
CREATE POLICY "Business members can view availability" ON public.employee_availability
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members bm1
            JOIN public.business_members bm2 ON bm1.business_id = bm2.business_id
            WHERE bm2.id = employee_availability.business_member_id
            AND bm1.user_id = auth.uid()
            AND bm1.is_active = true
        )
    );

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability" ON public.employee_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE id = employee_availability.business_member_id
            AND user_id = auth.uid()
        )
    );

-- Managers can manage team availability
CREATE POLICY "Managers can manage team availability" ON public.employee_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members bm1
            JOIN public.business_members bm2 ON bm1.business_id = bm2.business_id
            WHERE bm2.id = employee_availability.business_member_id
            AND bm1.user_id = auth.uid()
            AND bm1.role IN ('owner', 'manager')
            AND bm1.is_active = true
        )
    );

-- =============================================
-- SHIFTS POLICIES
-- =============================================

-- Business members can view shifts in their business
CREATE POLICY "Business members can view shifts" ON public.shifts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = shifts.business_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

-- Owners and managers can manage all shifts
CREATE POLICY "Owners/managers can manage shifts" ON public.shifts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = shifts.business_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'manager')
            AND is_active = true
        )
    );

-- Employees can update their own shift status
CREATE POLICY "Employees can update own shift status" ON public.shifts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE id = shifts.assigned_to
            AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE id = shifts.assigned_to
            AND user_id = auth.uid()
        )
    );

-- =============================================
-- SHIFT REQUESTS POLICIES
-- =============================================

-- Business members can view shift requests in their business
CREATE POLICY "Business members can view shift requests" ON public.shift_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shifts s
            JOIN public.business_members bm ON s.business_id = bm.business_id
            WHERE s.id = shift_requests.shift_id
            AND bm.user_id = auth.uid()
            AND bm.is_active = true
        )
    );

-- Users can create requests for their own shifts
CREATE POLICY "Users can create own shift requests" ON public.shift_requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE id = shift_requests.requested_by
            AND user_id = auth.uid()
        )
    );

-- Managers can approve/deny requests
CREATE POLICY "Managers can manage shift requests" ON public.shift_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.shifts s
            JOIN public.business_members bm ON s.business_id = bm.business_id
            WHERE s.id = shift_requests.shift_id
            AND bm.user_id = auth.uid()
            AND bm.role IN ('owner', 'manager')
            AND bm.is_active = true
        )
    );

-- =============================================
-- NOTIFICATIONS POLICIES
-- =============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- System can insert notifications
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- =============================================
-- AUDIT LOGS POLICIES
-- =============================================

-- Business owners can view audit logs
CREATE POLICY "Owners can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_id = audit_logs.business_id
            AND user_id = auth.uid()
            AND role = 'owner'
            AND is_active = true
        )
    );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Success message
SELECT 'Row Level Security policies created successfully!' as message;
