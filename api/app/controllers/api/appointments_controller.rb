class Api::AppointmentsController < Api::ApplicationController
  before_action :authorize_request, only: [:index, :create, :show, :update, :destroy]
  before_action :set_appointment, only: [:show, :update, :destroy]

  def index
    @appointments = current_user.appointments
    render json: @appointments.map { |apt| format_appointment(apt) }, status: :ok
  end

  def create
    appointment_data = appointment_params.to_h
    appointment_data['patient_name'] = appointment_data.delete('doctorName')
    
    # Combine date and time into appointment_date
    date = appointment_data.delete('date')
    time = appointment_data.delete('time')
    appointment_data['appointment_date'] = "#{date} #{time}" if date && time
    
    @appointment = current_user.appointments.build(appointment_data)
    if @appointment.save
      render json: format_appointment(@appointment), status: :created
    else
      render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: format_appointment(@appointment), status: :ok
  end

  def update
    appointment_data = appointment_params.to_h
    appointment_data['patient_name'] = appointment_data.delete('doctorName')
    
    # Combine date and time into appointment_date
    date = appointment_data.delete('date')
    time = appointment_data.delete('time')
    appointment_data['appointment_date'] = "#{date} #{time}" if date && time
    
    if @appointment.update(appointment_data)
      render json: format_appointment(@appointment), status: :ok
    else
      render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @appointment.destroy
      render json: { message: 'Appointment deleted successfully' }, status: :ok
    else
      render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:id])
    unless @appointment.user_id == current_user.id
      render json: { message: 'Not authorized' }, status: :unauthorized
    end
  end

  def appointment_params
    params.require(:appointment).permit(:doctorName, :date, :time, :reason)
  end

  def format_appointment(appointment)
    date_time = appointment.appointment_date
    {
      id: appointment.id,
      doctor_name: appointment.patient_name,
      date: date_time.to_date.to_s,
      time: date_time.strftime('%H:%M'),
      reason: appointment.reason,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    }
  end
end
