-- =============================================
-- CREATE TEST USERS (Run this after setting up auth)
-- =============================================
-- This script creates test users and associates them with businesses
-- Note: This should be run manually or through the application, not as part of initial setup

-- Function to create a test user and business member
CREATE OR REPLACE FUNCTION create_test_user_and_member(
    p_email TEXT,
    p_full_name TEXT,
    p_business_id UUID,
    p_role user_role DEFAULT 'employee',
    p_hourly_rate DECIMAL DEFAULT 15.00
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_member_id UUID;
BEGIN
    -- Generate a UUID for the user (simulating auth.users entry)
    v_user_id := gen_random_uuid();
    
    -- Insert user profile (normally done by trigger)
    INSERT INTO public.user_profiles (id, email, full_name, timezone)
    VALUES (v_user_id, p_email, p_full_name, 'America/New_York')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create business member
    INSERT INTO public.business_members (business_id, user_id, role, hourly_rate, hire_date, is_active)
    VALUES (p_business_id, v_user_id, p_role, p_hourly_rate, CURRENT_DATE, true)
    RETURNING id INTO v_member_id;
    
    RAISE NOTICE 'Created user % (%) as % for business %', p_full_name, p_email, p_role, p_business_id;
    
    RETURN v_member_id;
END;
$$ LANGUAGE plpgsql;

-- Create test users for Brew & Bean Coffee
DO $$
DECLARE
    v_brew_bean_id UUID := '550e8400-e29b-41d4-a716-446655440001';
    v_daily_grind_id UUID := '550e8400-e29b-41d4-a716-446655440002';
    v_owner_member_id UUID;
    v_manager_member_id UUID;
    v_emma_member_id UUID;
    v_alex_member_id UUID;
BEGIN
    -- Create owner for Brew & Bean
    v_owner_member_id := create_test_user_and_member(
        'sarah.owner@brewbean.com',
        'Sarah Johnson',
        v_brew_bean_id,
        'owner',
        25.00
    );
    
    -- Create manager for Brew & Bean
    v_manager_member_id := create_test_user_and_member(
        'mike.manager@brewbean.com',
        'Mike Chen',
        v_brew_bean_id,
        'manager',
        20.00
    );
    
    -- Create employees for Brew & Bean
    v_emma_member_id := create_test_user_and_member(
        'emma.barista@brewbean.com',
        'Emma Davis',
        v_brew_bean_id,
        'employee',
        16.00
    );
    
    v_alex_member_id := create_test_user_and_member(
        'alex.barista@brewbean.com',
        'Alex Rodriguez',
        v_brew_bean_id,
        'employee',
        15.50
    );
    
    -- Update some shifts to assign them to employees
    UPDATE public.shifts 
    SET assigned_to = v_emma_member_id, created_by = v_manager_member_id
    WHERE id IN ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440305');
    
    UPDATE public.shifts 
    SET assigned_to = v_alex_member_id, created_by = v_manager_member_id
    WHERE id IN ('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440306');
    
    -- Create employee availability for Emma (Monday-Friday, 6 AM - 2 PM)
    INSERT INTO public.employee_availability (business_member_id, day_of_week, start_time, end_time, is_available) VALUES
    (v_emma_member_id, 1, '06:00:00', '14:00:00', true),
    (v_emma_member_id, 2, '06:00:00', '14:00:00', true),
    (v_emma_member_id, 3, '06:00:00', '14:00:00', true),
    (v_emma_member_id, 4, '06:00:00', '14:00:00', true),
    (v_emma_member_id, 5, '06:00:00', '14:00:00', true);
    
    -- Create employee availability for Alex (Tuesday-Saturday, 2 PM - 10 PM)
    INSERT INTO public.employee_availability (business_member_id, day_of_week, start_time, end_time, is_available) VALUES
    (v_alex_member_id, 2, '14:00:00', '22:00:00', true),
    (v_alex_member_id, 3, '14:00:00', '22:00:00', true),
    (v_alex_member_id, 4, '14:00:00', '22:00:00', true),
    (v_alex_member_id, 5, '14:00:00', '22:00:00', true),
    (v_alex_member_id, 6, '14:00:00', '22:00:00', true);
    
    -- Create owner for The Daily Grind
    PERFORM create_test_user_and_member(
        'lisa.owner@dailygrind.com',
        'Lisa Thompson',
        v_daily_grind_id,
        'owner',
        30.00
    );
    
    RAISE NOTICE 'Test users and business members created successfully!';
END $$;

-- Clean up the helper function
DROP FUNCTION create_test_user_and_member(TEXT, TEXT, UUID, user_role, DECIMAL);
