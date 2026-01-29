# app/models/appointment.rb
class Appointment < ApplicationRecord
  # Associations
  # If an appointment belongs to a user:
  belongs_to :user

  # Validations
  validates :patient_name, presence: true
  validates :appointment_date, presence: true
  validates :reason, presence: true

  # Optional: Custom methods can go here
end
