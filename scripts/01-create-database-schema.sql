-- =============================================
-- CREATE COMPLETE DATABASE SCHEMA
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'employee');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE shift_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Extend the auth.users with additional profile information
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BUSINESS & ORGANIZATIONS
-- =============================================

CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    industry TEXT DEFAULT 'coffee_shop',
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS & BILLING
-- =============================================

CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status subscription_status DEFAULT 'trialing',
    plan_name TEXT NOT NULL DEFAULT 'starter',
    plan_price INTEGER DEFAULT 0, -- in cents
    employee_limit INTEGER DEFAULT 10,
    trial_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TEAM MANAGEMENT
-- =============================================

CREATE TABLE public.business_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'employee',
    hourly_rate DECIMAL(10,2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- =============================================
-- INVITATIONS
-- =============================================

CREATE TABLE public.invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status invitation_status DEFAULT 'pending',
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EMPLOYEE AVAILABILITY
-- =============================================

CREATE TABLE public.employee_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_member_id UUID REFERENCES public.business_members(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_member_id, day_of_week, start_time, end_time)
);

-- =============================================
-- SHIFTS & SCHEDULING
-- =============================================

CREATE TABLE public.shifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Shift',
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status shift_status DEFAULT 'scheduled',
    position TEXT, -- e.g., 'barista', 'cashier', 'manager'
    hourly_rate DECIMAL(10,2),
    break_duration INTEGER DEFAULT 0, -- in minutes
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- stores recurrence rules
    parent_shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL, -- for recurring shifts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SHIFT REQUESTS & CHANGES
-- =============================================

CREATE TABLE public.shift_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES public.business_members(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('time_off', 'shift_swap', 'pickup_shift', 'drop_shift')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reason TEXT,
    requested_start_time TIMESTAMP WITH TIME ZONE,
    requested_end_time TIMESTAMP WITH TIME ZONE,
    swap_with_member_id UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'shift_assigned', 'shift_changed', 'request_approved', etc.
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG
-- =============================================

CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Business members indexes
CREATE INDEX idx_business_members_business_id ON public.business_members(business_id);
CREATE INDEX idx_business_members_user_id ON public.business_members(user_id);
CREATE INDEX idx_business_members_role ON public.business_members(role);

-- Shifts indexes
CREATE INDEX idx_shifts_business_id ON public.shifts(business_id);
CREATE INDEX idx_shifts_assigned_to ON public.shifts(assigned_to);
CREATE INDEX idx_shifts_start_time ON public.shifts(start_time);
CREATE INDEX idx_shifts_end_time ON public.shifts(end_time);
CREATE INDEX idx_shifts_status ON public.shifts(status);
CREATE INDEX idx_shifts_date_range ON public.shifts(business_id, start_time, end_time);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_business_id ON public.notifications(business_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Invitations indexes
CREATE INDEX idx_invitations_business_id ON public.invitations(business_id);
CREATE INDEX idx_invitations_email ON public.invitations(email);
CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_status ON public.invitations(status);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_members_updated_at BEFORE UPDATE ON public.business_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_availability_updated_at BEFORE UPDATE ON public.employee_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_requests_updated_at BEFORE UPDATE ON public.shift_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create default subscription for new business
CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (business_id, plan_name, status)
    VALUES (NEW.id, 'starter', 'trialing');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default subscription
CREATE TRIGGER on_business_created
    AFTER INSERT ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION public.create_default_subscription();

-- Success message
SELECT 'Database schema created successfully!' as message;
