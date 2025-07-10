-- =============================================
-- SEED SAMPLE BUSINESSES AND SHIFTS
-- =============================================

-- Insert sample businesses
INSERT INTO public.businesses (id, name, slug, description, industry, address, phone, email, timezone, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Brew & Bean Coffee', 'brew-bean-coffee', 'Cozy neighborhood coffee shop serving artisan coffee and fresh pastries', 'coffee_shop', '123 Main St, Coffee City, CC 12345', '(555) 123-4567', 'hello@brewbean.com', 'America/New_York', '{"positions": ["barista", "cashier", "shift_lead"], "default_break_duration": 30}'),
('550e8400-e29b-41d4-a716-446655440002', 'The Daily Grind', 'daily-grind', 'Fast-paced coffee shop perfect for busy professionals', 'coffee_shop', '456 Business Ave, Metro City, MC 67890', '(555) 987-6543', 'info@dailygrind.com', 'America/Los_Angeles', '{"positions": ["barista", "manager"], "default_break_duration": 15}'),
('550e8400-e29b-41d4-a716-446655440003', 'Rustic Eats Restaurant', 'rustic-eats', 'Farm-to-table restaurant with a focus on local ingredients', 'restaurant', '789 Farm Road, Countryside, CS 11111', '(555) 456-7890', 'contact@rusticeats.com', 'America/Chicago', '{"positions": ["server", "cook", "host", "manager"], "default_break_duration": 30}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample shifts for Brew & Bean Coffee
INSERT INTO public.shifts (id, business_id, title, description, start_time, end_time, status, position, hourly_rate, notes) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440001', 'Morning Opening Shift', 'Open the store and handle morning rush', '2025-01-13 06:00:00-05', '2025-01-13 14:00:00-05', 'scheduled', 'barista', 16.00, 'Check espresso machine and prep pastries'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440001', 'Afternoon Shift', 'Handle afternoon customers and closing duties', '2025-01-13 14:00:00-05', '2025-01-13 22:00:00-05', 'scheduled', 'barista', 15.50, 'Clean equipment and restock supplies'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440001', 'Morning Opening Shift', 'Tuesday opening', '2025-01-14 06:00:00-05', '2025-01-14 14:00:00-05', 'scheduled', 'barista', 16.00, NULL),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440001', 'Afternoon Shift', 'Tuesday afternoon', '2025-01-14 14:00:00-05', '2025-01-14 22:00:00-05', 'scheduled', 'barista', 15.50, NULL),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440001', 'Weekend Morning', 'Saturday morning rush', '2025-01-18 07:00:00-05', '2025-01-18 15:00:00-05', 'scheduled', 'barista', 17.00, 'Weekend premium rate'),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440001', 'Weekend Afternoon', 'Saturday afternoon', '2025-01-18 15:00:00-05', '2025-01-18 21:00:00-05', 'scheduled', 'barista', 17.00, 'Weekend premium rate')
ON CONFLICT (id) DO NOTHING;

-- Insert shifts for The Daily Grind
INSERT INTO public.shifts (id, business_id, title, description, start_time, end_time, status, position, hourly_rate, notes) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440002', 'Early Bird Shift', 'Early morning prep and opening', '2025-01-13 05:30:00-08', '2025-01-13 13:30:00-08', 'scheduled', 'barista', 18.00, 'High-volume location - be prepared'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440002', 'Rush Hour Shift', 'Handle business district rush', '2025-01-13 13:30:00-08', '2025-01-13 21:30:00-08', 'scheduled', 'barista', 18.00, 'Peak hours - extra hands needed')
ON CONFLICT (id) DO NOTHING;

-- Create sample invitations
INSERT INTO public.invitations (id, business_id, email, role, status, token, expires_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440001', 'emma.barista@example.com', 'employee', 'pending', 'inv_token_001', NOW() + INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440001', 'alex.barista@example.com', 'employee', 'pending', 'inv_token_002', NOW() + INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440002', 'mike.manager@example.com', 'manager', 'pending', 'inv_token_003', NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Sample businesses, shifts, and invitations created successfully!' as message;
