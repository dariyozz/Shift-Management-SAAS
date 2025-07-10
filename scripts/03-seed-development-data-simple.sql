-- =============================================
-- SIMPLE SEED DATA (No user dependencies)
-- =============================================

-- Insert sample businesses
INSERT INTO public.businesses (id, name, slug, description, industry, address, phone, email, timezone, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Brew & Bean Coffee', 'brew-bean-coffee', 'Cozy neighborhood coffee shop serving artisan coffee and fresh pastries', 'coffee_shop', '123 Main St, Coffee City, CC 12345', '(555) 123-4567', 'hello@brewbean.com', 'America/New_York', '{"positions": ["barista", "cashier", "shift_lead"], "default_break_duration": 30}'),
('550e8400-e29b-41d4-a716-446655440002', 'The Daily Grind', 'daily-grind', 'Fast-paced coffee shop perfect for busy professionals', 'coffee_shop', '456 Business Ave, Metro City, MC 67890', '(555) 987-6543', 'info@dailygrind.com', 'America/Los_Angeles', '{"positions": ["barista", "manager"], "default_break_duration": 15}'),
('550e8400-e29b-41d4-a716-446655440003', 'Rustic Eats Restaurant', 'rustic-eats', 'Farm-to-table restaurant with a focus on local ingredients', 'restaurant', '789 Farm Road, Countryside, CS 11111', '(555) 456-7890', 'contact@rusticeats.com', 'America/Chicago', '{"positions": ["server", "cook", "host", "manager"], "default_break_duration": 30}')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Sample businesses created successfully!' as message;
