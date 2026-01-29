# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create admin user
admin = User.find_or_create_by!(email: 'admin@healthbook.com') do |user|
  user.name = 'Admin User'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = 'admin'
end
puts "Admin user created: #{admin.email}"

# Create sample users
sample_users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user'
  }
]

sample_users.each do |user_data|
  user = User.find_or_create_by!(email: user_data[:email]) do |u|
    u.name = user_data[:name]
    u.password = user_data[:password]
    u.password_confirmation = user_data[:password]
    u.role = user_data[:role]
  end
  puts "User created: #{user.email}"

  # Create sample appointments for each user
  3.times do |i|
    appointment = user.appointments.find_or_create_by!(
      doctor_name: ['Dr. Sarah Wilson', 'Dr. Michael Brown', 'Dr. Emily Davis'][i],
      date: (Date.today + (i + 1).days).to_s,
      time: ['09:00', '10:30', '14:00'][i]
    ) do |apt|
      apt.reason = ['Regular Checkup', 'Follow-up Visit', 'Consultation'][i]
    end
    puts "Appointment created for #{user.name}"
  end
end

puts "Seed data completed!"

