-- =============================================
-- SEED DEVELOPMENT DATA
-- =============================================
-- Note: This script creates sample data for development
-- In production, user_profiles are created automatically via auth triggers

-- First, let's create some sample businesses
INSERT INTO public.businesses (id, name, slug, description, industry, address, phone, email, timezone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Brew & Bean Coffee', 'brew-bean-coffee', 'Cozy neighborhood coffee shop serving artisan coffee and fresh pastries', 'coffee_shop', '123 Main St, Coffee City, CC 12345', '(555) 123-4567', 'hello@brewbean.com', 'America/New_York'),
('550e8400-e29b-41d4-a716-446655440002', 'The Daily Grind', 'daily-grind', 'Fast-paced coffee shop perfect for busy professionals', 'coffee_shop', '456 Business Ave, Metro City, MC 67890', '(555) 987-6543', 'info@dailygrind.com', 'America/Los_Angeles'),
('550e8400-e29b-41d4-a716-446655440003', 'Rustic Eats Restaurant', 'rustic-eats', 'Farm-to-table restaurant with a focus on local ingredients', 'restaurant', '789 Farm Road, Countryside, CS 11111', '(555) 456-7890', 'contact@rusticeats.com', 'America/Chicago')
ON CONFLICT (id) DO NOTHING;

-- Create sample positions/roles for businesses
INSERT INTO public.businesses (id, name, slug, description, industry, settings) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Demo Coffee Shop', 'demo-coffee-shop', 'A demo coffee shop for testing purposes', 'coffee_shop', '{"positions": ["barista", "cashier", "shift_lead", "manager"], "default_shift_length": 8, "break_duration": 30}')
ON CONFLICT (id) DO NOTHING;

-- Note: We'll create a separate script to handle user creation since it requires auth.users
-- For now, let's create some sample shifts without assigned users

-- Insert some unassigned shifts for demo purposes
INSERT INTO public.shifts (id, business_id, created_by, title, description, start_time, end_time, status, position, hourly_rate, notes) VALUES
-- This week's shifts at Brew & Bean (unassigned for now)
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Morning Opening Shift', 'Open the store and handle morning rush', '2025-01-13 06:00:00-05', '2025-01-13 14:00:00-05', 'scheduled', 'barista', 16.00, 'Check espresso machine and prep pastries'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Afternoon Shift', 'Handle afternoon customers and closing duties', '2025-01-13 14:00:00-05', '2025-01-13 22:00:00-05', 'scheduled', 'barista', 15.50, 'Clean equipment and restock supplies'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Morning Opening Shift', 'Tuesday opening', '2025-01-14 06:00:00-05', '2025-01-14 14:00:00-05', 'scheduled', 'barista', 16.00, NULL),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Afternoon Shift', 'Tuesday afternoon', '2025-01-14 14:00:00-05', '2025-01-14 22:00:00-05', 'scheduled', 'barista', 15.50, NULL),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Morning Opening Shift', 'Wednesday opening', '2025-01-15 06:00:00-05', '2025-01-15 14:00:00-05', 'scheduled', 'barista', 16.00, NULL),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Afternoon Shift', 'Wednesday afternoon', '2025-01-15 14:00:00-05', '2025-01-15 22:00:00-05', 'scheduled', 'barista', 15.50, NULL),
-- Weekend shifts
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Weekend Morning', 'Saturday morning rush', '2025-01-18 07:00:00-05', '2025-01-18 15:00:00-05', 'scheduled', 'barista', 17.00, 'Weekend premium rate'),
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Weekend Afternoon', 'Saturday afternoon', '2025-01-18 15:00:00-05', '2025-01-18 21:00:00-05', 'scheduled', 'barista', 17.00, 'Weekend premium rate')
ON CONFLICT (id) DO NOTHING;

-- Insert shifts for The Daily Grind
INSERT INTO public.shifts (id, business_id, created_by, title, description, start_time, end_time, status, position, hourly_rate, notes) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440002', NULL, 'Early Bird Shift', 'Early morning prep and opening', '2025-01-13 05:30:00-08', '2025-01-13 13:30:00-08', 'scheduled', 'barista', 18.00, 'High-volume location - be prepared'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440002', NULL, 'Rush Hour Shift', 'Handle business district rush', '2025-01-13 13:30:00-08', '2025-01-13 21:30:00-08', 'scheduled', 'barista', 18.00, 'Peak hours - extra hands needed')
ON CONFLICT (id) DO NOTHING;

-- Create some sample invitations (these can exist without users)
INSERT INTO public.invitations (id, business_id, email, role, status, token, expires_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440001', 'emma.barista@example.com', 'employee', 'pending', 'inv_token_001', NOW() + INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440001', 'alex.barista@example.com', 'employee', 'pending', 'inv_token_002', NOW() + INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440002', 'mike.manager@example.com', 'manager', 'pending', 'inv_token_003', NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- Add some sample audit logs
INSERT INTO public.audit_logs (id, business_id, action, resource_type, resource_id, new_values) VALUES
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'shift', '550e8400-e29b-41d4-a716-446655440301', '{"title": "Morning Opening Shift", "position": "barista"}'),
('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440302', 'CREATE', 'shift', '550e8400-e29b-41d4-a716-446655440001', '{"title": "Afternoon Shift", "position": "barista"}'),
('550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440001', 'INVITE', 'team_member', NULL, '{"email": "emma.barista@example.com", "role": "employee"}')
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '- 4 sample businesses';
    RAISE NOTICE '- 10 sample shifts';
    RAISE NOTICE '- 3 pending invitations';
    RAISE NOTICE '- 3 audit log entries';
    RAISE NOTICE '';
    RAISE NOTICE 'Note: User profiles and business members will be created when users sign up through the app.';
END $$;
