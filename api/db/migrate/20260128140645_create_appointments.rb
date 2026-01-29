class CreateAppointments < ActiveRecord::Migration[8.1]
  def change
    create_table :appointments do |t|
      t.string :patient_name
      t.datetime :appointment_date
      t.string :reason

      t.timestamps
    end
  end
end
