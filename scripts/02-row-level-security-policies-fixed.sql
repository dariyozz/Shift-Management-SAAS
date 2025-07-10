-- =============================================
-- FIXED ROW LEVEL SECURITY POLICIES
-- =============================================

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Business members can view business" ON public.businesses;
DROP POLICY IF EXISTS "Owners can update business" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can create business" ON public.businesses;
DROP POLICY IF EXISTS "Business owners/managers can view subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Owners can update subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Business members can view team" ON public.business_members;
DROP POLICY IF EXISTS "Owners/managers can manage team" ON public.business_members;
DROP POLICY IF EXISTS "Users can update own member info" ON public.business_members;
DROP POLICY IF EXISTS "Owners/managers can manage invitations" ON public.invitations;
DROP POLICY IF EXISTS "Anyone can view invitation by token" ON public.invitations;
DROP POLICY IF EXISTS "Business members can view availability" ON public.employee_availability;
DROP POLICY IF EXISTS "Users can manage own availability" ON public.employee_availability;
DROP POLICY IF EXISTS "Managers can manage team availability" ON public.employee_availability;
DROP POLICY IF EXISTS "Business members can view shifts" ON public.shifts;
DROP POLICY IF EXISTS "Owners/managers can manage shifts" ON public.shifts;
DROP POLICY IF EXISTS "Employees can update own shift status" ON public.shifts;
DROP POLICY IF EXISTS "Business members can view shift requests" ON public.shift_requests;
DROP POLICY IF EXISTS "Users can create own shift requests" ON public.shift_requests;
DROP POLICY IF EXISTS "Managers can manage shift requests" ON public.shift_requests;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Owners can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- =============================================
-- USER PROFILES POLICIES
-- =============================================

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- BUSINESSES POLICIES (SIMPLIFIED)
-- =============================================

-- Authenticated users can create businesses
CREATE POLICY "Authenticated users can create business" ON public.businesses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can view businesses they are members of
CREATE POLICY "Members can view their business" ON public.businesses
    FOR SELECT USING (
        id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Business owners can update their business
CREATE POLICY "Owners can update business" ON public.businesses
    FOR UPDATE USING (
        id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role = 'owner' AND is_active = true
        )
    );

-- =============================================
-- BUSINESS MEMBERS POLICIES (SIMPLIFIED)
-- =============================================

-- Authenticated users can insert business members (for initial business creation)
CREATE POLICY "Authenticated users can create business members" ON public.business_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can view business members in their business
CREATE POLICY "Members can view team in same business" ON public.business_members
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Owners and managers can update business members
CREATE POLICY "Owners and managers can update team" ON public.business_members
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true
        )
    );

-- Users can update their own member record (limited)
CREATE POLICY "Users can update own member record" ON public.business_members
    FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- SUBSCRIPTIONS POLICIES
-- =============================================

-- Business owners and managers can view subscription
CREATE POLICY "Owners and managers can view subscription" ON public.subscriptions
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true
        )
    );

-- Only owners can update subscription
CREATE POLICY "Owners can update subscription" ON public.subscriptions
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role = 'owner' AND is_active = true
        )
    );

-- System can insert subscriptions (for triggers)
CREATE POLICY "System can insert subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

-- =============================================
-- INVITATIONS POLICIES
-- =============================================

-- Owners and managers can manage invitations
CREATE POLICY "Owners and managers can manage invitations" ON public.invitations
    FOR ALL USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true
        )
    );

-- Anyone can view invitations by token (for accepting)
CREATE POLICY "Anyone can view invitation by token" ON public.invitations
    FOR SELECT USING (true);

-- =============================================
-- EMPLOYEE AVAILABILITY POLICIES
-- =============================================

-- Business members can view availability in their business
CREATE POLICY "Members can view availability in business" ON public.employee_availability
    FOR SELECT USING (
        business_member_id IN (
            SELECT id FROM public.business_members
            WHERE business_id IN (
                SELECT business_id FROM public.business_members
                WHERE user_id = auth.uid() AND is_active = true
            )
        )
    );

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability" ON public.employee_availability
    FOR ALL USING (
        business_member_id IN (
            SELECT id FROM public.business_members
            WHERE user_id = auth.uid()
        )
    );

-- Managers can manage team availability
CREATE POLICY "Managers can manage team availability" ON public.employee_availability
    FOR ALL USING (
        business_member_id IN (
            SELECT bm1.id FROM public.business_members bm1
            JOIN public.business_members bm2 ON bm1.business_id = bm2.business_id
            WHERE bm2.user_id = auth.uid() AND bm2.role IN ('owner', 'manager') AND bm2.is_active = true
        )
    );

-- =============================================
-- SHIFTS POLICIES
-- =============================================

-- Business members can view shifts in their business
CREATE POLICY "Members can view shifts in business" ON public.shifts
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Owners and managers can manage all shifts
CREATE POLICY "Owners and managers can manage shifts" ON public.shifts
    FOR ALL USING (
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true
        )
    );

-- Employees can update their own shift status
CREATE POLICY "Employees can update own shift status" ON public.shifts
    FOR UPDATE USING (
        assigned_to IN (
            SELECT id FROM public.business_members
            WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- SHIFT REQUESTS POLICIES
-- =============================================

-- Business members can view shift requests in their business
CREATE POLICY "Members can view shift requests in business" ON public.shift_requests
    FOR SELECT USING (
        shift_id IN (
            SELECT id FROM public.shifts
            WHERE business_id IN (
                SELECT business_id FROM public.business_members
                WHERE user_id = auth.uid() AND is_active = true
            )
        )
    );

-- Users can create requests for shifts in their business
CREATE POLICY "Users can create shift requests" ON public.shift_requests
    FOR INSERT WITH CHECK (
        requested_by IN (
            SELECT id FROM public.business_members
            WHERE user_id = auth.uid()
        )
    );

-- Managers can approve/deny requests
CREATE POLICY "Managers can manage shift requests" ON public.shift_requests
    FOR UPDATE USING (
        shift_id IN (
            SELECT id FROM public.shifts
            WHERE business_id IN (
                SELECT business_id FROM public.business_members
                WHERE user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true
            )
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
        business_id IN (
            SELECT business_id FROM public.business_members
            WHERE user_id = auth.uid() AND role = 'owner' AND is_active = true
        )
    );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Success message
SELECT 'Fixed Row Level Security policies created successfully!' as message;
